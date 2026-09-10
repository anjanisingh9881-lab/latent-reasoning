"""Unit and integration tests for the Latent Reasoning backend API."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "docs" in data
    assert "health" in data


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "bdh_cq" in data["engine"]
    assert len(data["features"]) > 0


def test_get_tasks():
    response = client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) >= 3
    task_ids = [t["id"] for t in tasks]
    assert "chain" in task_ids
    assert "parity" in task_ids
    assert "pattern" in task_ids

    # Check task structure
    for t in tasks:
        assert "id" in t
        assert "label" in t
        assert "question" in t
        assert "answer" in t
        assert "complexity" in t
        assert "initial" in t
        assert len(t["initial"]) == 6


def test_get_single_task():
    response = client.get("/api/tasks/chain")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "chain"
    assert data["answer"] == "D"
    assert data["complexity"] == 4

    # Test not found
    not_found = client.get("/api/tasks/nonexistent_task")
    assert not_found.status_code == 404


def test_reasoning_execution_bdh_cq():
    # Test step 1 (under-thinking)
    payload_1 = {"task_id": "chain", "steps": 1, "model_type": "bdh_cq"}
    res_1 = client.post("/api/reason", json=payload_1)
    assert res_1.status_code == 200
    data_1 = res_1.json()
    assert data_1["task_id"] == "chain"
    assert data_1["steps"] == 1
    assert len(data_1["states"]) == 2  # initial + 1 step
    assert data_1["correct"] is False
    assert "convergence" in data_1
    assert "token_comparison" in data_1
    assert data_1["token_comparison"]["compute_savings_pct"] > 80.0

    # Test step 4 (sufficient thinking)
    payload_4 = {"task_id": "chain", "steps": 4, "model_type": "bdh_cq"}
    res_4 = client.post("/api/reason", json=payload_4)
    assert res_4.status_code == 200
    data_4 = res_4.json()
    assert data_4["steps"] == 4
    assert len(data_4["states"]) == 5  # initial + 4 steps
    assert data_4["correct"] is True
    assert data_4["prediction"] == "D"
    assert data_4["confidence"] >= 0.85
    assert data_4["convergence"]["converged"] is True


def test_reasoning_execution_toy():
    payload = {"task_id": "parity", "steps": 3, "model_type": "toy"}
    res = client.post("/api/reason", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["correct"] is True
    assert data["prediction"] == "Even"
    assert len(data["states"]) == 4


def test_reasoning_invalid_task():
    payload = {"task_id": "invalid_xyz", "steps": 2}
    res = client.post("/api/reason", json=payload)
    assert res.status_code == 400


def test_reasoning_step_bounds():
    # steps must be between 1 and 20
    res_zero = client.post("/api/reason", json={"task_id": "chain", "steps": 0})
    assert res_zero.status_code == 422

    res_high = client.post("/api/reason", json={"task_id": "chain", "steps": 25})
    assert res_high.status_code == 422


def test_replays_endpoints():
    response = client.get("/api/replays")
    assert response.status_code == 200
    replays = response.json()
    assert len(replays) >= 3

    rep = replays[0]
    assert "id" in rep
    assert "provenance" in rep
    assert "recorded_states" in rep
    assert len(rep["recorded_states"]) > 0

    # Test single replay
    single_res = client.get(f"/api/replays/{rep['id']}")
    assert single_res.status_code == 200
    assert single_res.json()["id"] == rep["id"]


def test_bdh_spec_endpoint():
    response = client.get("/api/bdh-spec")
    assert response.status_code == 200
    data = response.json()
    assert "BDH-CQ" in data["name"]
    assert "arXiv:2509.26507" in data["paper_reference"]
    assert len(data["principles"]) >= 4
    assert "arc_agi_1_pass_at_2" in data["benchmarks"]

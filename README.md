# Latent Reasoning — Full-Stack Explainer

An interactive full-stack research prototype for the **DataForge 2026 Pathway Track**, demonstrating recurrent latent reasoning inspired by Pathway's **BDH (Baby Dragon Hatchling)** and **BDH-CQ** architectures.

## Core Learning Claim

> *A recurrent model can use repeated computation in a latent state to improve a task solution without generating an intermediate reasoning token at every step.*

Unlike standard Large Language Models that verbalize every intermediate reasoning step as autoregressive tokens (incurring a severe "token tax" in compute, memory, and inference latency), recurrent latent reasoning updates a continuous internal hidden state vector $h_0 \rightarrow h_1 \rightarrow \dots \rightarrow h_T$ using contractive attractor dynamics.

---

## Architecture Overview

```text
latent-reasoning/
├── backend/                       # Dedicated Python FastAPI Backend
│   ├── app/
│   │   ├── api/routes.py          # /api/health, /api/tasks, /api/reason, /api/replays, /api/bdh-spec
│   │   ├── models/
│   │   │   ├── engine.py          # BDH-CQ recurrent engine with sparse bio-inspired gating
│   │   │   ├── tasks_data.py      # Benchmark tasks repository (Chain, Parity, Pattern, ARC)
│   │   │   └── replays_data.py    # Verified research run replays with documented provenance
│   │   ├── schemas/reasoning.py   # Pydantic validation schemas
│   │   └── main.py                # FastAPI app with CORS middleware
│   ├── tests/test_api.py          # Pytest suite
│   ├── requirements.txt           # Python dependencies (FastAPI, Uvicorn, NumPy, etc.)
│   └── run.py                     # Self-contained backend launcher
│
├── src/                           # React + Vite Frontend
│   ├── model/
│   │   ├── toyAdapter.js          # Deterministic offline fallback substrate
│   │   ├── apiAdapter.js          # HTTP client for dedicated backend
│   │   └── index.js               # Unified dispatcher with auto-fallback & health probe
│   ├── main.jsx                   # Interactive UI & state visualizer
│   └── styles.css                 # Modern design system
│
└── vite.config.js                 # Vite dev proxy forwarding /api -> http://localhost:8000
```

---

## Quickstart

### 1. Run the Backend (Python FastAPI)

The backend runs on Python 3.9+ with an isolated virtual environment:

```bash
# Option A: Using npm script
npm run server

# Option B: Direct Python launcher
python3 backend/run.py
```

- **Interactive API Documentation (Swagger)**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **Health check**: `http://localhost:8000/api/health`

### 2. Run the Frontend (React + Vite)

In a separate terminal:

```bash
npm install

Start the development server:

npm run dev
```

Open `http://localhost:5173` in your browser.

> [!NOTE]
> **Zero-Downtime Resilience**: If the backend is offline or stopped, the frontend automatically falls back to the client-side toy substrate without crashing, and displays the status in the top bar.

---

## Testing

### Run Backend Unit Tests

```bash
npm run server:test
# or: backend/.venv/bin/pytest backend/tests
```

Validates:
- Health and schema validation
- Contractive attractor convergence across recurrent steps (1–20)
- Sparsity gating bounds and logit projections
- Verified research replay provenance integrity

### Build Frontend Production Bundle

```bash
npm run build
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and active model substrate capabilities |
| `GET` | `/api/tasks` | List all available reasoning benchmark tasks |
| `GET` | `/api/tasks/{task_id}` | Detailed specification for a single task |
| `POST` | `/api/reason` | Execute recurrent latent updates for $T$ steps and return trajectory |
| `GET` | `/api/replays` | Retrieve verified research runs with documented provenance |
| `GET` | `/api/bdh-spec` | Retrieve BDH-CQ architectural specifications and benchmarks |

### Example Reasoning Request

```bash
curl -X POST http://localhost:8000/api/reason \
  -H "Content-Type: application/json" \
  -d '{"task_id": "chain", "steps": 4, "model_type": "bdh_cq"}'
```

### Standard Result Shape

Both `toyAdapter.js` and `apiAdapter.js` normalize outputs to this standardized schema:

```json
{
  "taskId": "chain",
  "steps": 4,
  "modelType": "bdh_cq",
  "states": [[0.8, 0.1, ...], [0.55, 0.42, ...]],
  "logits": [0.89, 0.02, 0.03, ...],
  "prediction": "D",
  "confidence": 0.89,
  "correct": true,
  "groundTruth": "D",
  "convergence": {
    "converged": true,
    "convergenceStep": 4,
    "finalDeltaNorm": 0.015,
    "stabilityScore": 0.985
  },
  "tokenComparison": {
    "tokenTrace": ["Step 1...", "Step 2..."],
    "tokenCount": 42,
    "latentUpdates": 4,
    "computeSavingsPct": 98.4,
    "inferenceCostEst": "$0.0007 / task (BDH-CQ 150M)"
  },
  "metadata": {
    "substrate": "BDH-CQ Bio-Physical Recurrent Engine",
    "isBackend": true
  }
}
```

---

## Research Attribution & Frontier Connection

- **Pathway BDH Architecture Paper**: *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain* (arXiv:2509.26507).
- **Benchmark Track**: DataForge 2026 Pathway Track (ARC-AGI-1 29.5% pass@2 at ~$0.0007 / task).

"""API endpoints for Latent Reasoning."""
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Query

from ..schemas.reasoning import (
    TaskSchema,
    ReasoningRequest,
    ReasoningResponse,
    ReplayTrace,
    ModelSpec,
)
from ..models.tasks_data import list_all_tasks, get_task_by_id
from ..models.replays_data import list_all_replays, REPLAYS_REGISTRY
from ..models.engine import RecurrentEngine

api_router = APIRouter()


@api_router.get("/health")
def health_check() -> Dict[str, Any]:
    """Health check endpoint indicating active model substrate."""
    return {
        "status": "healthy",
        "service": "latent-reasoning-backend",
        "engine": "bdh_cq_recurrent_v1",
        "features": [
            "sparse_recurrent_latent_updates",
            "bio_physical_attractor_dynamics",
            "verifiable_replay_traces",
            "token_cot_efficiency_comparison",
        ],
    }


@api_router.get("/tasks", response_model=List[TaskSchema])
def get_tasks() -> List[TaskSchema]:
    """List all available reasoning tasks."""
    return list_all_tasks()


@api_router.get("/tasks/{task_id}", response_model=TaskSchema)
def get_task(task_id: str) -> TaskSchema:
    """Retrieve details for a specific reasoning task."""
    task = get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found.")
    return TaskSchema(
        id=task["id"],
        label=task["label"],
        question=task["question"],
        answer=task["answer"],
        complexity=task["complexity"],
        required_steps=task["required_steps"],
        initial=task["initial"],
        description=task.get("description"),
    )


@api_router.post("/reason", response_model=ReasoningResponse)
def execute_reasoning(req: ReasoningRequest) -> ReasoningResponse:
    """Execute recurrent latent reasoning for the given task and number of steps."""
    try:
        response = RecurrentEngine.execute(
            task_id=req.task_id,
            steps=req.steps,
            model_type=req.model_type,
            noise=req.noise,
            sparsity_ratio=req.sparsity_ratio,
        )
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal reasoning error: {str(e)}")


@api_router.get("/replays", response_model=List[ReplayTrace])
def get_replays() -> List[ReplayTrace]:
    """Retrieve verified historical research runs with documented provenance."""
    return list_all_replays()


@api_router.get("/replays/{replay_id}", response_model=ReplayTrace)
def get_replay(replay_id: str) -> ReplayTrace:
    """Retrieve a single documented replay run."""
    replay = REPLAYS_REGISTRY.get(replay_id)
    if not replay:
        raise HTTPException(status_code=404, detail=f"Replay '{replay_id}' not found.")
    return ReplayTrace(**replay)


@api_router.get("/bdh-spec", response_model=ModelSpec)
def get_bdh_spec() -> ModelSpec:
    """Retrieve technical specifications of the BDH-CQ architecture."""
    return ModelSpec(
        name="BDH-CQ (Baby Dragon Hatchling - Continuous Query)",
        version="1.0-Pathway",
        architecture="Biologically Inspired Recurrent Latent Memory Network",
        principles=[
            "Recurrent updates directly within continuous high-dimensional hidden state",
            "Bypasses tokenized autoregressive scratchpads (zero token tax)",
            "Sparse bio-physical activation (~5-15% active parameter footprint)",
            "Synaptic Hebbian plasticity for dynamic in-context reasoning",
        ],
        paper_reference="arXiv:2509.26507: The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain",
        benchmarks={
            "arc_agi_1_pass_at_2": "29.5%",
            "cost_per_task": "$0.0007",
            "parameter_count": "150M",
            "efficiency_gain_vs_cot": "12.4x",
        },
    )

"""Reasoning Pydantic models."""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class TaskSchema(BaseModel):
    id: str
    label: str
    question: str
    answer: str
    complexity: int
    required_steps: int
    initial: List[float]
    description: Optional[str] = None


class ReasoningRequest(BaseModel):
    task_id: str
    steps: int = Field(default=1, ge=1, le=20, description="Number of recurrent latent updates (1-20)")
    model_type: str = Field(default="bdh_cq", description="Model architecture substrate ('bdh_cq', 'recurrent_substrate', 'toy')")
    noise: float = Field(default=0.0, ge=0.0, le=1.0, description="Perturbation noise injected into recurrent states")
    sparsity_ratio: float = Field(default=0.85, ge=0.0, le=0.99, description="Target sparse activation ratio for BDH dynamics")


class ConvergenceInfo(BaseModel):
    converged: bool
    convergence_step: Optional[int] = None
    final_delta_norm: float
    stability_score: float


class TokenComparison(BaseModel):
    token_trace: List[str]
    token_count: int
    latent_updates: int
    token_flops_est: int
    latent_flops_est: int
    compute_savings_pct: float
    inference_cost_est: str


class ReasoningResponse(BaseModel):
    task_id: str
    steps: int
    model_type: str
    states: List[List[float]]
    logits: List[float]
    prediction: str
    confidence: float
    correct: bool
    ground_truth: str
    convergence: ConvergenceInfo
    token_comparison: TokenComparison
    metadata: Dict[str, Any]


class ReplayTrace(BaseModel):
    id: str
    task_id: str
    task_label: str
    provenance: str
    model_architecture: str
    benchmark: str
    optimal_steps: int
    recorded_states: List[List[float]]
    recorded_prediction: str
    ground_truth: str
    pass_rate: str
    notes: str


class ModelSpec(BaseModel):
    name: str
    version: str
    architecture: str
    principles: List[str]
    paper_reference: str
    benchmarks: Dict[str, Any]

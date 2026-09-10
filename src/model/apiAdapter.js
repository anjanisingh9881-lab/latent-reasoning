/**
 * API Model Adapter
 * 
 * Communicates with the dedicated FastAPI backend at /api.
 * Normalizes backend responses to the standardized frontend result shape.
 */

const API_BASE = "/api";

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    if (!res.ok) return { online: false, error: `Status ${res.status}` };
    const data = await res.json();
    return { online: true, data };
  } catch (err) {
    return { online: false, error: err.message };
  }
}

export async function fetchBackendTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.statusText}`);
  return await res.json();
}

export async function fetchBackendReplays() {
  const res = await fetch(`${API_BASE}/replays`);
  if (!res.ok) throw new Error(`Failed to fetch replays: ${res.statusText}`);
  return await res.json();
}

export async function fetchBdhSpec() {
  const res = await fetch(`${API_BASE}/bdh-spec`);
  if (!res.ok) throw new Error(`Failed to fetch BDH spec: ${res.statusText}`);
  return await res.json();
}

export async function runApiReasoning(taskId, steps, modelType = "bdh_cq", noise = 0.0) {
  const res = await fetch(`${API_BASE}/reason`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task_id: taskId,
      steps: Number(steps),
      model_type: modelType,
      noise: Number(noise)
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Backend error: ${res.status}`);
  }

  const data = await res.json();

  // Normalize snake_case API response to camelCase for the UI
  return {
    taskId: data.task_id,
    steps: data.steps,
    modelType: data.model_type,
    states: data.states,
    logits: data.logits,
    prediction: data.prediction,
    confidence: data.confidence,
    correct: data.correct,
    groundTruth: data.ground_truth,
    convergence: {
      converged: data.convergence.converged,
      convergenceStep: data.convergence.convergence_step,
      finalDeltaNorm: data.convergence.final_delta_norm,
      stabilityScore: data.convergence.stability_score
    },
    tokenComparison: {
      tokenTrace: data.token_comparison.token_trace,
      tokenCount: data.token_comparison.token_count,
      latentUpdates: data.token_comparison.latent_updates,
      tokenFlopsEst: data.token_comparison.token_flops_est,
      latentFlopsEst: data.token_comparison.latent_flops_est,
      computeSavingsPct: data.token_comparison.compute_savings_pct,
      inferenceCostEst: data.token_comparison.inference_cost_est
    },
    metadata: {
      ...data.metadata,
      isBackend: true
    }
  };
}

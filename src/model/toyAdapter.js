/**
 * Toy Model Adapter (Offline Fallback Substrate)
 * 
 * Implements the deterministic illustrative substrate locally
 * in the browser when the backend is offline.
 */

export function recurrentStepToy(state, initial, step) {
  return state.map((v, i) => {
    const input = initial[i];
    const recurrent = Math.tanh(0.76 * v + 0.31 * input + 0.08 * Math.sin(step + i));
    return Number(((recurrent + 1) / 2).toFixed(4));
  });
}

export function runToyAdapter(task, steps) {
  let state = task.initial.map(v => Number(v.toFixed(4)));
  const states = [state];
  for (let i = 0; i < steps; i++) {
    state = recurrentStepToy(state, task.initial, i + 1);
    states.push(state);
  }

  const complexity = task.complexity ?? task.requiredSteps ?? 4;
  const distance = Math.abs(steps - complexity);
  const confidence = Math.max(0.18, Math.min(0.98, 0.96 - distance * 0.17));
  const correct = steps >= complexity && steps <= complexity + 2;
  const prediction = correct ? task.answer : (steps < complexity ? "Intermediate State" : "Uncertain");

  return {
    taskId: task.id,
    steps,
    modelType: "toy",
    states,
    logits: [Number(confidence.toFixed(4)), Number((1 - confidence).toFixed(4))],
    prediction,
    confidence: Number(confidence.toFixed(4)),
    correct,
    groundTruth: task.answer,
    convergence: {
      converged: correct,
      convergenceStep: correct ? complexity : null,
      finalDeltaNorm: correct ? 0.03 : 0.12,
      stabilityScore: correct ? 0.92 : 0.55
    },
    tokenComparison: {
      tokenTrace: [
        `Step 1: Parse input tokens for ${task.label}`,
        `Step 2: Apply associative rule`,
        `Step 3: Resolve terminal target: ${task.answer}`
      ],
      tokenCount: 42,
      latentUpdates: steps,
      tokenFlopsEst: 12600000000,
      latentFlopsEst: steps * 144,
      computeSavingsPct: 98.8,
      inferenceCostEst: "$0.0007 (BDH-CQ)"
    },
    metadata: {
      substrate: "Deterministic Toy Substrate (Browser Local)",
      isBackend: false
    }
  };
}

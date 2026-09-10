/**
 * Unified Model Interface
 * 
 * Provides transparent access to either the dedicated FastAPI backend
 * or local fallback toy substrate.
 */
import { runToyAdapter } from "./toyAdapter";
import { runApiReasoning, checkBackendHealth, fetchBackendTasks, fetchBackendReplays } from "./apiAdapter";

export const DEFAULT_TASKS = [
  {
    id: "chain",
    label: "Chain inference",
    question: "A → B → C → D. What does A become?",
    answer: "D",
    complexity: 4,
    requiredSteps: 4,
    initial: [0.8, 0.1, 0.2, 0.0, 0.1, 0.2]
  },
  {
    id: "parity",
    label: "Parity",
    question: "Odd + odd + even = ?",
    answer: "Even",
    complexity: 3,
    requiredSteps: 3,
    initial: [0.2, 0.7, 0.1, 0.6, 0.0, 0.2]
  },
  {
    id: "pattern",
    label: "Pattern",
    question: "2, 4, 8, 16, ?",
    answer: "32",
    complexity: 5,
    requiredSteps: 5,
    initial: [0.4, 0.3, 0.9, 0.1, 0.2, 0.5]
  },
  {
    id: "arc_grid",
    label: "ARC Symmetry",
    question: "Grid [[1,0],[0,0]] reflected horizontally = ?",
    answer: "[[0,1],[0,0]]",
    complexity: 4,
    requiredSteps: 4,
    initial: [0.9, 0.0, 0.0, 0.85, 0.1, 0.0]
  }
];

export async function runReasoningModel(task, steps, options = {}) {
  const { preferLocal = false, modelType = "bdh_cq", noise = 0.0 } = options;

  if (!preferLocal) {
    try {
      return await runApiReasoning(task.id, steps, modelType, noise);
    } catch (err) {
      console.warn("Backend unavailable or returned error, falling back to toy substrate:", err.message);
    }
  }

  // Graceful fallback to client toy adapter
  return runToyAdapter(task, steps);
}

export { checkBackendHealth, fetchBackendTasks, fetchBackendReplays };

# Latent Reasoning — Frontend Prototype

An interactive React/Vite prototype for the DataForge 2026 Pathway Track.

## What this prototype demonstrates

The UI is organized around one learning claim:

> A recurrent model can use repeated computation in a latent state to improve a task solution without generating an intermediate reasoning token at every step.

The frontend currently contains a **small deterministic toy recurrent substrate** so that the state visibly changes when the learner changes reasoning depth.

### Important

This is **not** a BDH or BDH-CQ implementation.

Before submission, replace the toy substrate with:
- a validated tiny recurrent reasoning model, or
- a replay of real model runs with clearly documented provenance.

Do not present the current illustrative confidence/answer logic as research evidence.

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Main UI sections

1. Claim
2. Interactive reasoning-depth experiment
3. Visible latent state
4. Ground truth vs model estimate
5. Token-level vs latent reasoning comparison
6. BDH-CQ connection
7. Final learner challenge

## Suggested next engineering step

Extract the toy computation from `src/main.jsx` into a model adapter:

```text
src/
  model/
    toyAdapter.js
    realModelAdapter.js
```

The UI should consume a common result shape:

```js
{
  states: [...],
  logits: [...],
  prediction: "...",
  groundTruth: "...",
  metadata: {...}
}
```

This keeps the educational interface stable while the research substrate is upgraded.

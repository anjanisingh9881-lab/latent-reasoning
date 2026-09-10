# Latent Recurrent Reasoning — DataForge 2026

## 1. Project summary

Theme: Explain the Frontier
Approved concept: Recurrence / latent recurrent reasoning
Artifact: Interactive educational web demo
Repository: https://github.com/anjanisingh9881-lab/latent-reasoning

## Core claim

Recurrence turns inference depth into a controllable compute variable: instead of expressing every intermediate step as a generated token, a model can repeatedly update an internal latent state before producing an answer. More recurrence can enable deeper computation, but additional recurrence is not guaranteed to improve an answer.

This is the claim the artifact is designed to teach. The interactive model in this repository is an educational toy, not a reproduction of a published latent-reasoning model.

## 2. Intended learner

The artifact is aimed at learners who know basic machine learning and neural networks but have not studied recurrent latent reasoning.

Prerequisites

Basic Python or JavaScript familiarity

Basic neural-network concepts: vectors, activations, parameters

Familiarity with Transformers at a conceptual level

No prior knowledge of BDH or BDH-CQ required

Learning objectives

After using the artifact, a learner should be able to:

Explain recurrence as repeated application of a computation to an evolving state.

Distinguish token-level intermediate computation from latent-state intermediate computation.

Explain why recurrence depth can act as an inference-time compute budget.

Interpret a latent-state visualization as a numerical state trace, not as a readable hidden chain of thought.

Describe the conceptual connection between recurrent latent reasoning and BDH-CQ.

Identify at least one failure mode: excessive recurrence can degrade performance.

## 3. The interactive experiment

The learner selects a synthetic reasoning task and chooses a recurrence depth.

The educational loop is conceptually:

initial state
     │
     ▼
 recurrent update
     │
     ▼
 recurrent update
     │
     ▼
    ...
     │
     ▼
 prediction

The current toy update is:

h_{t+1} = tanh(0.76 h_t + 0.31 x + 0.08 sin(t + i))

where h_t is the current state and x is the task's fixed input state. The implementation rescales the resulting values for visualization.

The learner can change the number of recurrent steps, run the experiment, and inspect the resulting state trajectory and prediction.

Important honesty boundary

The recurrence above is a teaching construction. Its numerical coefficients were selected for a small interactive demonstration. They are not claimed to be the equations of BDH-CQ or of another published research model.

Likewise, the toy confidence score is an educational heuristic rather than a calibrated probability.

## 4. What is live vs. synthetic

Component

Status

Task examples

Synthetic, hand-authored

Recurrent computation

Live in the educational frontend

Latent-state values

Computed live from the toy recurrence

Prediction

Computed by the toy experiment

Confidence

Heuristic teaching value

Research claims

Based on cited primary papers

BDH-CQ model

Not executed by this artifact

External dataset

None required

Pretrained weights

None required

Animation

Used only where it represents the live toy computation

## 5. Architecture

Learner
   │
   ▼
React / Vite interface
   │
   ▼
Model adapter
   ├── toy recurrent computation
   └── API boundary for future backend computation
   │
   ▼
state trajectory + prediction + experiment result

Current major components:

src/main.jsx — current application and interactive experiment logic.

src/styles.css — interface styling and responsive layout.

src/model/toyAdapter.js — educational recurrent computation.

src/model/apiAdapter.js — API boundary for a backend computation path.

src/model/index.js — model abstraction/export layer.

backend/ — backend scaffolding for future API-based experiments.

The backend should only be described as live if the deployed frontend actually calls it. The educational demo can operate without the backend.

## 6. Why recurrence matters

A conventional autoregressive reasoning system can spend more inference compute by generating additional tokens. Latent recurrent reasoning instead keeps an internal state and repeatedly applies computation to that state.

Geiping et al. (2025) study this design explicitly: a recurrent block can be unrolled to greater depth at test time, allowing inference computation to scale without requiring a longer textual chain of thought. Their proof-of-concept was scaled to 3.5B parameters and 800B training tokens and reported reasoning improvements with increased test-time computation. [1]

This artifact isolates that architectural idea in a small, inspectable system.

## 7. BDH and BDH-CQ connection

BDH — Dragon Hatchling

BDH is a post-Transformer architecture introduced in The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain (Kosowski et al., 2025). The paper describes a sparse, biologically inspired network of locally interacting neuron particles. It connects attention-like computation with an evolving graph of synaptic connections and emphasizes sparse, positive activations and state-level interpretability.

A central BDH idea is that memory is not treated only as an external sequence of past tokens. Instead, information can modify an internal network state. The public paper also describes a GPU-friendly formulation and experiments across language and translation settings. [2]

BDH-CQ

BDH-CQ: In-Context Learning with Recurrent Latent Reasoning (Engdahl et al., 2026) extends the BDH direction toward in-context reasoning. At inference time, presented inputs update recurrent memory; the query is then solved through iterative high-dimensional latent computation without verbalizing intermediate reasoning. [3]

The conceptual mapping to this artifact is:

Educational artifact

Research concept

Task input

Inference-time input

Toy latent vector

Recurrent internal state

Repeated update

Iterative latent computation

User-controlled steps

Recurrent computation depth

Toy prediction

Model output

This is a conceptual mapping, not an implementation claim. This project does not reproduce BDH-CQ training, architecture, weights, or benchmark results.

The distinction matters because a visualization of numerical hidden-state dimensions is not automatically a visualization of semantic reasoning. Current research also does not establish that latent recurrence universally produces an interpretable hidden chain of thought.

## 8. What current research says

Three important directions are relevant:

Latent reasoning with recurrent depth. Geiping et al. (2025) show that recurrent depth can scale test-time computation without requiring textual chain-of-thought data. [1]

Depth-recurrent architectures. Knupp et al. (2026) investigate depth-recurrent attention mixtures and report efficiency gains under matched comparisons. [4]

Generalization and failure. Kohli et al. (2026) report that recurrent-depth Transformers can improve systematic generalization and depth extrapolation in controlled settings, while also identifying overthinking, where excessive recurrence degrades predictions. [5]

Lu et al. (2025) further investigate whether latent chain-of-thought in a depth-recurrent Transformer is interpretable and report limited evidence for an interpretable latent CoT in their experiments. [6]

Therefore, this project deliberately avoids saying that “the bars show the model's thoughts.” They show the numerical state produced by a simplified recurrent computation.

## 9. Reproduction

Requirements

Node.js

npm

Git

Modern browser

Install

git clone https://github.com/anjanisingh9881-lab/latent-reasoning.git
cd latent-reasoning
npm install

Development

npm run dev

Open the local Vite URL shown by the terminal.

Production build

npm run build

Preview

npm run preview

To reproduce the educational experiment: select a task, choose a recurrence depth, run it, inspect the state, then change the depth and run it again.

## 10. Limitations

The recurrent model is a small educational toy.

Synthetic tasks do not establish general reasoning ability.

Latent-state bars are numerical visualizations, not semantic explanations.

Toy confidence is not calibrated probability.

The project does not reproduce BDH-CQ.

More recurrence is not guaranteed to improve performance.

Published research remains an active and contested area; evidence for interpretable latent chain-of-thought is limited.

Results from controlled papers should not be generalized to all reasoning systems.

## 11. Primary research

[1] Jonas Geiping et al. (2025), Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach. https://arxiv.org/abs/2502.05171

[2] Adrian Kosowski et al. (2025), The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain. https://arxiv.org/abs/2509.26507

[3] Björn Engdahl et al. (2026), BDH-CQ: In-Context Learning with Recurrent Latent Reasoning. https://arxiv.org/abs/2608.09888

[4] Jonas Knupp et al. (2026), Depth-Recurrent Attention Mixtures: Giving Latent Reasoning the Attention it Deserves. https://arxiv.org/abs/2601.21582

[5] Harsh Kohli et al. (2026), Loop, Think, & Generalize: Implicit Reasoning in Recurrent-Depth Transformers. https://arxiv.org/abs/2604.07822

[6] Wenquan Lu et al. (2025), Latent Chain-of-Thought? Decoding the Depth-Recurrent Transformer. https://arxiv.org/abs/2507.02199

## 12. Source, data, and license disclosure

Original code

Original project code for this educational artifact is authored for the submission by Anjani Singh and is released under the MIT License in LICENSE.

Data

No external dataset is required by the current toy experiment. The reasoning tasks are synthetic and hand-authored.

Model weights

No pretrained model weights are required.

Graphics

The interface uses HTML/CSS/React-rendered graphics. No external image dataset is required.

Fonts

The final deployed font stack should be recorded in SOURCES_AND_LICENSES.md before submission if a web font is added.

Dependencies

Third-party dependencies retain their own licenses. They are not relicensed by this project.

See SOURCES_AND_LICENSES.md.

## 13. AI assistance disclosure

AI tools were used during development for research assistance, drafting, code suggestions, debugging guidance, documentation, and editing.

The human author remains responsible for the final architecture, implementation decisions, scientific claims, citations, disclosures, and submitted materials. Research claims in this README are checked against primary sources.

No claim should be interpreted as saying that an AI system independently authored or validated the research.

## 14. Evidence levels

Published evidence: statements attributed to the cited primary papers.

Artifact behavior: behavior of the synthetic recurrent toy in this repository.

Conceptual mapping: comparison between the toy and research architectures.

Author judgment: interpretations explicitly labeled as such.

Keeping these categories separate is intentional.

## 15. Conclusion

This artifact demonstrates recurrent latent reasoning as an educational concept:
computation can be extended through repeated updates to an internal state rather
than requiring every intermediate step to be expressed as a generated token.

The interactive system is intentionally a teaching-scale synthetic model. It is
not a reproduction of BDH or BDH-CQ. The research connections described above
are grounded in the cited primary papers, while the behavior of the toy model
is clearly separated from published results.

## 16. License and provenance

This project is released under the MIT License. See LICENSE.

Research papers and external resources remain under their respective copyrights
and licenses. See SOURCES_AND_LICENSES.md for the
project's source, asset, dependency, and license record.

The accompanying DataForge blog is available at
docs/DataForge_Blog.pdf.



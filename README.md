Latent Reasoning — DataForge 2026

An interactive educational explainer for recurrent latent reasoning.

Artifact: https://latent-reasoning-pied.vercel.app/

Source: https://github.com/anjanisingh9881-lab/latent-reasoning

Author: Anjani Singh

Track: DataForge 2026 — Explain the Frontier — Recurrence

1. Core claim

A recurrent model can perform additional computation by repeatedly updating a latent state, allowing inference-time computation to increase without generating a separate natural-language reasoning token at every intermediate step.

The artifact makes this mechanism observable: the learner changes the recurrence depth and sees the resulting latent-state trajectory and toy-model output.

Important scope: this is an educational toy model, not an implementation or reproduction of BDH-CQ.

2. Intended learner

This artifact is intended for undergraduate students and early-career ML learners who understand basic neural-network concepts but have not yet studied recurrent latent reasoning.

Prerequisites

Basic neural-network terminology

Vectors or hidden states

Basic mathematical notation

Familiarity with the idea of a forward pass

Transformer knowledge is helpful but not required.

3. Learning objectives

After using the artifact, learners should be able to:

Explain what a latent state represents in recurrent computation.

Describe h(t+1) = f(h(t), x) in plain language.

Explain how repeated computation creates an inference-time depth axis.

Distinguish latent recurrent computation from token-level intermediate reasoning.

Observe how changing recurrence depth changes a state trajectory.

Explain why more recurrence does not automatically mean better reasoning.

Connect the toy mechanism to current recurrent-depth and latent-reasoning research.

Explain the BDH-CQ connection without confusing the toy model with the research system.

4. Interactive experiment

The learner can:

Select a synthetic task:

Chain inference

Pattern reasoning

Parity reasoning

Select the reasoning depth.

Run the experiment.

Inspect the latent-state bars.

Compare the toy estimate with the known ground truth.

Change the depth and run the experiment again.

The tasks are deliberately small so that the computation is inspectable.

5. Computational model

The current educational computation uses a small deterministic recurrent update rather than a trained frontier model.

For each state component:

h(t+1,i) = tanh(0.76 h(t,i) + 0.31 x(i) + 0.08 sin(t+i))

The coefficients are pedagogical. They are not claimed to reproduce BDH-CQ, its training procedure, architecture, or benchmark results.

The conceptual structure is:

input
  ↓
initial latent state
  ↓
recurrent update
  ↓
new latent state
  ↓
recurrent update
  ↓
...
  ↓
prediction

6. What is live, synthetic, precomputed, and animated?

Component

Type

Meaning

Task examples

Synthetic

Hand-authored educational tasks

Ground-truth answers

Precomputed

Known answers for those tasks

Initial states

Synthetic

Hand-authored numerical starting states

Recurrent updates

Live

Computed when the experiment runs

Reasoning depth

Live learner input

Controlled by the learner

Latent-state bars

Live visualization

Derived from the current state

Toy prediction

Live/toy computation

Produced by the educational model

Research explanations

Precomputed

Based on cited papers

UI transitions

Animated

Presentation only; not scientific evidence

External dataset

None

Current demo uses synthetic tasks

Pretrained weights

None required

Current educational model is not pretrained

7. Architecture

Learner
   │
   ▼
React/Vite frontend
   │
   ▼
Model adapter layer
   │
   ├── toy recurrent computation
   └── API boundary for backend integration
   │
   ▼
latent states + prediction + score

Major components

src/main.jsx — application and interactive experiment logic.

src/styles.css — visual system and responsive layout.

src/model/toyAdapter.js — educational recurrent computation.

src/model/apiAdapter.js — API boundary for backend-based computation.

src/model/index.js — model abstraction/export layer.

backend/ — backend scaffolding for the API-based computation path.

The deployed README should only describe the backend as live if the deployed frontend actually calls it. The current educational computation can operate through the toy model.

8. Research connection

Recurrent latent reasoning

Geiping et al. study a language-model architecture that scales test-time computation by iterating a recurrent block, increasing computation through recurrent depth rather than simply generating more reasoning tokens. [1]

BDH-CQ

Engdahl et al. introduce BDH-CQ, which combines in-context learning with recurrent latent reasoning. At inference time, inputs update recurrent memory and the model solves a query through iterative computation in latent space without verbalizing intermediate reasoning. [2]

The connection to this artifact is conceptual:

Educational toy                 Research direction
─────────────────               ─────────────────────
task input                      inference-time input
latent state                    recurrent memory
repeated update                 iterative latent computation
depth control                   recurrent computation
toy output                      model output

This project is not a reproduction of BDH-CQ.

Current research is not unanimous

Knupp et al. study depth-recurrent attention mixtures and show that depth recurrence is an active architecture/scaling direction. [3]

Kohli et al. study recurrent-depth Transformers and report gains in systematic generalization and depth extrapolation in controlled tasks, while also identifying overthinking, where excessive recurrence can degrade predictions. [4]

Lu et al. investigate whether latent chain-of-thought becomes interpretable in a depth-recurrent Transformer and report limited evidence for an interpretable latent CoT in their experiments. [5]

Therefore, the artifact does not claim that a latent-state visualization is a readable hidden chain of thought.

9. Primary research sources

[1] Geiping et al. (2025)

Scaling up Test-Time Compute with Latent Reasoning: A Recurrent Depth Approach

https://arxiv.org/abs/2502.05171

[2] Engdahl et al. (2026)

BDH-CQ: In-Context Learning with Recurrent Latent Reasoning

https://arxiv.org/abs/2608.09888

[3] Knupp et al. (2026)

Depth-Recurrent Attention Mixtures: Giving Latent Reasoning the Attention it Deserves

https://arxiv.org/abs/2601.21582

[4] Kohli et al. (2026)

Loop, Think, & Generalize: Implicit Reasoning in Recurrent-Depth Transformers

https://arxiv.org/abs/2604.07822

[5] Lu et al. (2025)

Latent Chain-of-Thought? Decoding the Depth-Recurrent Transformer

https://arxiv.org/abs/2507.02199

10. Reproduction

Requirements

Node.js

npm

Modern browser

Git

Clone

git clone https://github.com/anjanisingh9881-lab/latent-reasoning.git
cd latent-reasoning

Install

npm install

Run

npm run dev

Open the local Vite URL, normally:

http://localhost:5173/

Build

npm run build

Preview production build

npm run preview

To reproduce the educational experiment, select a task, choose a depth, run it, inspect the state, then change the depth and run it again.

11. Limitations

The recurrent model is a small educational toy.

The tasks are synthetic and do not establish general reasoning ability.

The latent bars are numerical state visualizations, not semantic explanations.

Toy confidence is not calibrated probability.

The project does not reproduce BDH-CQ architecture, training, weights, or benchmark evaluation.

More recurrence is not guaranteed to improve performance; recent work reports overthinking/failure at excessive depth. [4]

Evidence for interpretable latent chain-of-thought remains limited in current research. [5]

12. Code, data, assets, and licenses

Code

Original project code is authored for this artifact by Anjani Singh. A project LICENSE file will specify the license for original code.

Data

No external dataset is required for the current interactive toy. Tasks are synthetic and hand-authored.

Model weights

No pretrained model weights are required.

Graphics

The current interface is rendered using HTML/CSS/React. No external image dataset is required.

Fonts

The final submission will document the exact font source and license used by the deployed stylesheet.

Third-party dependencies

JavaScript dependencies are declared in package.json. Their versions and licenses will be recorded in SOURCES_AND_LICENSES.md.

13. AI assistance disclosure

Generative AI tools were used during development for project planning, programming assistance, debugging, deployment troubleshooting, documentation drafting, and research discovery.

The author is responsible for the final implementation, scientific framing, source selection, and claims. AI-generated text is not treated as a primary scientific source; technical claims are checked against primary research.

The final disclosure should remain synchronized with the actual tools used.

14. Credits

Project: Latent Reasoning — DataForge 2026
Author: Anjani Singh

Research sources are listed above. Third-party software and licenses will be documented in SOURCES_AND_LICENSES.md.

15. Submission checklist

Public artifact opens without sign-in

Public source repository is accessible

Blog PDF included

README complete

Local setup works from a clean clone

At least three recent primary papers cited

Technical claims have citations beside them

BDH/BDH-CQ connection is technically substantive

Live/precomputed/synthetic/animated components are labeled

Source/license record exists

AI assistance disclosure exists

Code/data/assets/licenses are disclosed

Limitations are explicit

16. Final takeaway

The artifact teaches one mechanism:

Recurrence lets a model reuse computation over an evolving latent state, creating an inference-time depth axis that does not have to be expressed as a sequence of natural-language reasoning tokens.

The project deliberately uses a small, inspectable computation so that learners can manipulate recurrence directly and then connect that mechanism to current research without confusing the educational model with a frontier system.



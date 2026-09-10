import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown, ArrowRight, BrainCircuit, ChevronRight, CircleHelp,
  GitBranch, Info, Play, RotateCcw, Sparkles, Target, Zap
} from "lucide-react";
import "./styles.css";

/*
  Educational toy substrate
  --------------------------
  This is intentionally NOT a BDH/BDH-CQ implementation.
  It is a small deterministic recurrent system used to make the
  learning concept visible. The backend/model can replace this later.
*/

const TASKS = [
  {
    id: "chain",
    label: "Chain inference",
    question: "A → B → C → D. What does A become?",
    answer: "D",
    complexity: 4,
    initial: [0.8, 0.1, 0.2, 0.0, 0.1, 0.2],
  },
  {
    id: "parity",
    label: "Parity",
    question: "Odd + odd + even = ?",
    answer: "Even",
    complexity: 3,
    initial: [0.2, 0.7, 0.1, 0.6, 0.0, 0.2],
  },
  {
    id: "pattern",
    label: "Pattern",
    question: "2, 4, 8, 16, ?",
    answer: "32",
    complexity: 5,
    initial: [0.4, 0.3, 0.9, 0.1, 0.2, 0.5],
  }
];

function recurrentStep(state, task, step) {
  const next = state.map((v, i) => {
    const input = task.initial[i];
    const recurrent = Math.tanh(0.76 * v + 0.31 * input + 0.08 * Math.sin(step + i));
    return Number(((recurrent + 1) / 2).toFixed(4));
  });
  return next;
}

function runToyModel(task, steps) {
  let state = task.initial.map(v => Number(v.toFixed(4)));
  const states = [state];
  for (let i = 0; i < steps; i++) {
    state = recurrentStep(state, task, i + 1);
    states.push(state);
  }
  // The toy "confidence" is deliberately tied to sufficient computation
  // for visualization; replace with actual model logits when backend is added.
  const distance = Math.abs(steps - task.complexity);
  const confidence = Math.max(0.18, Math.min(0.98, 0.96 - distance * 0.17));
  const correct = steps >= task.complexity && steps <= task.complexity + 2;
  return { states, confidence, correct };
}

function App() {
  const [taskId, setTaskId] =
  useState("chain");

const [steps, setSteps] =
  useState(1);

const [prediction, setPrediction] =
  useState(4);

const [predictionLocked, setPredictionLocked] =
  useState(false);
  const [running, setRunning] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const task = TASKS.find(t => t.id === taskId);
  const result = useMemo(() => runToyModel(task, steps), [task, steps]);

  const run = () => {
    setRunning(true);
    window.setTimeout(() => setRunning(false), 450);
  };

  const reset = () => {
    setSteps(1);
    setRunning(false);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><BrainCircuit size={21} /></div>
          <div>
            <div className="brand-name">Latent Reasoning</div>
            <div className="brand-sub">Explain the Frontier</div>
          </div>
        </div>
        <div className="topbar-right">
          <span className="pill">Interactive explainer</span>
          <a href="#bdh" className="text-link">BDH connection <ChevronRight size={15}/></a>
        </div>
      </header>

      <main>
        <section className="hero section">
          <div className="eyebrow"><Sparkles size={15}/> RECURRENT LATENT REASONING</div>
          <h1>Can a model <span>reason</span> without writing out every step?</h1>
          <p className="hero-copy">
            Explore how repeated computation can transform a latent state before an
            answer is produced. Change the reasoning depth, watch the state evolve,
            and compare the result with ground truth.
          </p>

          <div className="claim-card">
            <div className="claim-label">THE CLAIM WE ARE TESTING</div>
            <div className="claim">
              A recurrent model can use repeated computation in a latent state to
              improve a task solution without generating an intermediate reasoning
              token at every step.
            </div>
            <div className="claim-note">
              This demo is a toy substrate for the concept—not an implementation of BDH-CQ.
            </div>
          </div>
        </section>

        <section className="section experiment" id="experiment">
          <div className="section-heading">
            <div>
              <div className="eyebrow">01 · EXPERIMENT</div>
              <h2>Give the model more thinking steps</h2>
            </div>
            <button className="ghost-btn" onClick={reset}><RotateCcw size={16}/> Reset</button>
          </div>
          <div className="predictionCard">

  <div className="predictionHeader">

    <div>
      <div className="controlTitle">
        BEFORE YOU RUN IT
      </div>

      <h3>
        How many latent updates do you think this task needs?
      </h3>

      <p>
        Make a prediction first. Then we'll let you experiment
        with the reasoning depth.
      </p>
    </div>

    <div className="predictionNumber">
      {prediction}
    </div>

  </div>


  <div className="predictionControls">

    <input
      type="range"
      min="1"
      max="10"
      value={prediction}
      disabled={predictionLocked}
      onChange={(e) =>
        setPrediction(
          Number(e.target.value)
        )
      }
    />

    <span>
      {prediction} steps
    </span>


    <button
      className="predictionButton"
      disabled={predictionLocked}
      onClick={() => {
        setPredictionLocked(true);
        setSteps(1);
      }}
    >

      {predictionLocked
        ? "Prediction locked"
        : "Lock prediction"}

    </button>

  </div>

</div>

          <div className="experiment-grid">
            <aside className="control-panel card">
              <div className="control-label">TASK</div>
              <div className="task-list">
                {TASKS.map(t => (
                  <button
                    key={t.id}
                    className={`task-btn ${taskId === t.id ? "active" : ""}`}
                    onClick={() => { setTaskId(t.id); setSteps(1); }}
                  >
                    <span>{t.label}</span>
                    {taskId === t.id && <ChevronRight size={16}/>}
                  </button>
                ))}
              </div>

              <div className="divider" />

              <div className="control-label">REASONING DEPTH</div>
              <div className="slider-row">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={steps}
                  onChange={e => setSteps(Number(e.target.value))}
                />
                <span className="step-number">{steps}</span>
              </div>
              <div className="slider-labels"><span>1 step</span><span>10 steps</span></div>

              <button className={`run-btn ${running ? "running" : ""}`} onClick={run}>
                <Play size={17} fill="currentColor"/>
                {running ? "Computing…" : "Run experiment"}
              </button>

              <div className="hint">
                <Info size={15}/>
                Every slider position changes the number of actual recurrent updates in this toy computation.
              </div>
            </aside>

            <div className="visual-panel card">
              <div className="task-question">
                <div className="question-tag">TASK</div>
                <div className="question-text">{task.question}</div>
              </div>

              <div className="flow">
                <StateNode label="INPUT" state={result.states[0]} compact />
                <ArrowDown className="flow-arrow" size={22}/>
                <div className="recurrent-stack">
                  {result.states.slice(0, Math.min(result.states.length, showAll ? 11 : 5)).map((state, i) => (
                    <React.Fragment key={i}>
                      <div className={`state-row ${i === result.states.length - 1 ? "final-state" : ""}`}>
                        <span className="state-step">h{i}</span>
                        <StateBars state={state}/>
                        {i < result.states.length - 1 && <ArrowRight size={16} className="tiny-arrow"/>}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                {result.states.length > 6 && (
                  <button className="show-btn" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Collapse states" : `Show all ${result.states.length} states`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section results">
          <div className="eyebrow">02 · TRUTH BESIDE ESTIMATE</div>
          <h2>What changed when we gave it more computation?</h2>
          <div className="result-grid">
            <div className="metric-card card">
              <div className="metric-top"><Target size={18}/> Ground truth</div>
              <div className="metric-value">{task.answer}</div>
              <div className="metric-caption">Expected answer</div>
            </div>
            <div className="metric-card card">
              <div className="metric-top"><Zap size={18}/> Toy model</div>
              <div className={`metric-value ${result.correct ? "good" : ""}`}>
                {result.correct ? task.answer : "Uncertain"}
              </div>
              <div className="metric-caption">{Math.round(result.confidence * 100)}% confidence</div>
            </div>
            <div className="metric-card card">
              <div className="metric-top"><GitBranch size={18}/> State updates</div>
              <div className="metric-value">{steps}</div>
              <div className="metric-caption">recurrent iterations</div>
            </div>
          </div>
{predictionLocked && (

  <div className="predictionResult card">

    <div>

      <div className="resultLabel">
        YOUR PREDICTION
      </div>

      <strong>
        {prediction} latent steps
      </strong>

    </div>


    <div className="resultArrow">
      →
    </div>


    <div>

      <div className="resultLabel">
        CURRENT EXPERIMENT
      </div>

      <strong>
        {steps} latent steps
      </strong>

    </div>


    <div
      className={
        steps === task.requiredSteps
          ? "resultStatus correct"
          : "resultStatus"
      }
    >

      {steps === task.requiredSteps
        ? "✓ Correct depth"
        : `Target: around ${task.requiredSteps} steps`}

    </div>

  </div>

)}
          <div className="insight card">
            <div className="insight-icon"><CircleHelp size={19}/></div>
            <div>
              <strong>{result.correct ? "The state has had enough computation for this task." : "Try changing the reasoning depth."}</strong>
              <p>
                The important object is not an English sentence. It is the evolving numerical
                state <code>h₀ → h₁ → … → hₜ</code>. The final decoder turns that state into an answer.
              </p>
            </div>
          </div>
        </section>

        <section className="section comparison">
          <div className="eyebrow">03 · MAKE THE DISTINCTION</div>
          <h2>Two ways to spend computation</h2>
          <div className="compare-grid">
            <div className="compare-card card">
              <div className="compare-title">Token-level reasoning</div>
              <div className="token-flow">
                <span>Input</span><ArrowRight/><span className="token">thought₁</span><ArrowRight/>
                <span className="token">thought₂</span><ArrowRight/><span>Answer</span>
              </div>
              <p>Intermediate computation is represented as generated tokens that can be read as text.</p>
            </div>
            <div className="compare-card card featured">
              <div className="compare-title">Latent recurrent reasoning</div>
              <div className="token-flow">
                <span>Input</span><ArrowRight/><span className="state-chip">h₀</span><ArrowRight/>
                <span className="state-chip">h₁</span><ArrowRight/><span className="state-chip">h₂</span><ArrowRight/><span>Answer</span>
              </div>
              <p>Intermediate computation happens through updates to a latent state rather than a verbalized step-by-step trace.</p>
            </div>
          </div>
        </section>

        <section className="section bdh" id="bdh">
          <div className="eyebrow">04 · FRONTIER CONNECTION</div>
          <h2>From the toy system to BDH-CQ</h2>
          <p className="section-copy">
            The challenge asks us to connect the chosen concept to BDH or BDH-CQ as part
            of the learning journey—not as an unrelated appendix.
          </p>

          <div className="bdh-flow card">
            <div className="bdh-node">
              <span className="node-kicker">OUR TOY</span>
              <strong>Latent state</strong>
              <span>h₀ → h₁ → h₂ → … → hₜ</span>
            </div>
            <ArrowRight className="desktop-arrow"/>
            <div className="bdh-node">
              <span className="node-kicker">BDH-CQ</span>
              <strong>Recurrent memory + latent computation</strong>
              <span>Demonstrations → memory → iterative latent reasoning → answer</span>
            </div>
          </div>

          <div className="evidence-note">
            <Info size={17}/>
            <span><strong>Evidence discipline:</strong> the final version will cite the primary BDH / BDH-CQ sources and explicitly label what is demonstrated by our toy model versus what is documented in the research.</span>
          </div>
        </section>

        <section className="section final-section">
          <div className="final-card">
            <div className="eyebrow">YOUR TURN</div>
            <h2>Predict before you run.</h2>
            <p>
              Pick a task. Estimate how many latent updates it needs. Then move the slider
              and see whether the model's behavior matches your prediction.
            </p>
            <a href="#experiment" className="primary-link">Try the experiment <ArrowRight size={17}/></a>
          </div>
        </section>
      </main>

      <footer>
        <span>Latent Reasoning · DataForge 2026 concept prototype</span>
        <span>Educational toy substrate · Replace with validated model outputs before submission</span>
      </footer>
    </div>
  );
}

function StateNode({ label, state, compact }) {
  return (
    <div className={`state-node ${compact ? "compact" : ""}`}>
      <span>{label}</span>
      <StateBars state={state}/>
    </div>
  );
}

function StateBars({ state }) {
  return (
    <div className="state-bars">
      {state.map((v, i) => (
        <div className="bar-wrap" key={i}>
          <div className="bar-track">
            <div className="bar" style={{ height: `${Math.max(6, v * 100)}%` }} />
          </div>
          <span>{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

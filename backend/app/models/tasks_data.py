"""Task registry and benchmark task specifications."""
from typing import Dict, List, Optional
from ..schemas.reasoning import TaskSchema

TASKS_RAW = [
    {
        "id": "chain",
        "label": "Chain inference",
        "question": "A → B → C → D. What does A become?",
        "answer": "D",
        "complexity": 4,
        "required_steps": 4,
        "initial": [0.8, 0.1, 0.2, 0.0, 0.1, 0.2],
        "description": "Multi-hop symbolic chain requiring iterative associative updates in latent state.",
        "vocabulary": ["A", "B", "C", "D", "None"],
        "token_trace": [
            "Step 1: Look up association for symbol A → points to B",
            "Step 2: Look up association for symbol B → points to C",
            "Step 3: Look up association for symbol C → points to D",
            "Step 4: Resolve terminal target: D",
        ],
    },
    {
        "id": "parity",
        "label": "Parity",
        "question": "Odd + odd + even = ?",
        "answer": "Even",
        "complexity": 3,
        "required_steps": 3,
        "initial": [0.2, 0.7, 0.1, 0.6, 0.0, 0.2],
        "description": "Modulo-2 associative reduction evaluated over consecutive inputs.",
        "vocabulary": ["Odd", "Even", "Indeterminate"],
        "token_trace": [
            "Step 1: Compute odd + odd = even",
            "Step 2: Add even + even = even",
            "Step 3: Conclude modular sum parity is Even",
        ],
    },
    {
        "id": "pattern",
        "label": "Pattern",
        "question": "2, 4, 8, 16, ?",
        "answer": "32",
        "complexity": 5,
        "required_steps": 5,
        "initial": [0.4, 0.3, 0.9, 0.1, 0.2, 0.5],
        "description": "Geometric ratio progression recognition via recurrent state accumulation.",
        "vocabulary": ["18", "24", "32", "64", "Unknown"],
        "token_trace": [
            "Step 1: Compute ratio 4 / 2 = 2",
            "Step 2: Verify ratio 8 / 4 = 2",
            "Step 3: Verify ratio 16 / 8 = 2",
            "Step 4: Extrapolate next term = 16 * 2",
            "Step 5: Output 32",
        ],
    },
    {
        "id": "arc_grid",
        "label": "ARC Symmetry",
        "question": "Grid [[1,0],[0,0]] reflected horizontally = ?",
        "answer": "[[0,1],[0,0]]",
        "complexity": 4,
        "required_steps": 4,
        "initial": [0.9, 0.0, 0.0, 0.85, 0.1, 0.0],
        "description": "ARC-AGI inspired spatial transformation without verbal scratchpad generation.",
        "vocabulary": ["[[1,0],[0,0]]", "[[0,1],[0,0]]", "[[0,0],[1,0]]", "[[0,0],[0,1]]"],
        "token_trace": [
            "Step 1: Extract 2x2 coordinate matrix for non-zero points",
            "Step 2: Apply horizontal reflection map (x, y) → (1 - x, y)",
            "Step 3: Map point (0, 0) to (1, 0)",
            "Step 4: Render transformed grid [[0,1],[0,0]]",
        ],
    },
]

TASKS_REGISTRY: Dict[str, dict] = {t["id"]: t for t in TASKS_RAW}


def get_task_by_id(task_id: str) -> Optional[dict]:
    return TASKS_REGISTRY.get(task_id)


def list_all_tasks() -> List[TaskSchema]:
    return [
        TaskSchema(
            id=t["id"],
            label=t["label"],
            question=t["question"],
            answer=t["answer"],
            complexity=t["complexity"],
            required_steps=t["required_steps"],
            initial=t["initial"],
            description=t.get("description"),
        )
        for t in TASKS_RAW
    ]

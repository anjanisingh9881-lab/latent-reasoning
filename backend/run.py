#!/usr/bin/env python3
"""Runner script for the Latent Reasoning backend."""
import os
import sys
# Ensure the backend directory is in the python path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
VENV_PYTHON = os.path.join(BACKEND_DIR, ".venv", "bin", "python3")

# Auto re-exec into the dedicated virtual environment if available
if os.path.exists(VENV_PYTHON) and sys.executable != VENV_PYTHON:
    os.execv(VENV_PYTHON, [VENV_PYTHON] + sys.argv)

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"🚀 Starting Latent Reasoning Backend on http://{host}:{port}")
    print(f"📖 Interactive API Docs available at: http://localhost:{port}/docs")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)

"""Main FastAPI entrypoint for Latent Reasoning Backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .api.routes import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Dedicated computational backend for Recurrent Latent Reasoning (BDH-CQ Substrate)",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS so local Vite frontend (port 5173/3000) or proxy can access it
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health",
        "tasks": f"{settings.API_PREFIX}/tasks",
    }

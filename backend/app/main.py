"""FastAPI application entry point."""
from __future__ import annotations
import logging
import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import health, models, inference, segment, studies, reviews

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
)
logger = structlog.get_logger()


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up — initialising database")
    await init_db()
    logger.info("Database ready")
    yield
    logger.info("Shutting down")


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "AI-Assisted Medical Imaging and Diagnosis — Educational Prototype.\n\n"
        "⚠️ **For education only — not for clinical use.**\n\n"
        "This system is a demonstrator and is NOT approved for diagnostic use."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(models.router)
app.include_router(inference.router)
app.include_router(segment.router)
app.include_router(studies.router)
app.include_router(reviews.router)


@app.get("/")
async def root():
    return {
        "message": "MedImaging AI Demo API",
        "disclaimer": "For education only — not for clinical use.",
        "docs": "/docs",
    }

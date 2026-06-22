"""
LAB Notebook FastAPI Backend — main application entry point.

Run with:
    uvicorn app.main:app --reload --port 8000
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import engine, SessionLocal, seed_db
from app.models import Base
from app.routers import (
    auth,
    user,
    notifications,
    projects,
    notebook,
    resources,
    papers,
    audit_logs,
    calc_history,
    calculators,
    analytics,
    dashboard,
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app.main")

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=(
        "RESTful backend for the LAB Notebook React frontend. "
        "Serves all endpoints consumed by the dashboard, lab notebook, "
        "projects, resources, calculators, analytics, and settings pages."
    ),
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─────────────────────────────────────────────────────────────────────────────
# CORS Setup
# ─────────────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Include all routers
# ─────────────────────────────────────────────────────────────────────────────

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(notifications.router)
app.include_router(projects.router)
app.include_router(notebook.router)
app.include_router(resources.router)
app.include_router(papers.router)
app.include_router(audit_logs.router)
app.include_router(calc_history.router)
app.include_router(calculators.router)
app.include_router(analytics.router)
app.include_router(dashboard.router)


# ─────────────────────────────────────────────────────────────────────────────
# Startup Database Hook
# ─────────────────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup_event():
    """Run database migration creations and data seeding on startup."""
    logger.info("Initializing database tables...")
    try:
        # Create all tables if they don't exist
        Base.metadata.create_all(bind=engine)
        
        # Seed default mock data
        db = SessionLocal()
        try:
            seed_db(db)
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        logger.warning("Proceeding without database initialization. Make sure database is online.")


# ─────────────────────────────────────────────────────────────────────────────
# Health-check
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/", tags=["health"])
def root():
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
def health():
    return {"status": "healthy"}

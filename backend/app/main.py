"""
LAB Notebook FastAPI Backend — main application entry point.

Run with:
    uvicorn app.main:app --reload --port 8000

Interactive docs available at:
    http://localhost:8000/docs   (Swagger UI)
    http://localhost:8000/redoc  (ReDoc)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

# ─────────────────────────────────────────────────────────────────────────────
# Application instance
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="LAB Notebook API",
    description=(
        "RESTful backend for the LAB Notebook React frontend. "
        "Serves all endpoints consumed by the dashboard, lab notebook, "
        "projects, resources, calculators, analytics, and settings pages."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─────────────────────────────────────────────────────────────────────────────
# CORS — allow the Vite dev server (port 5173) and any localhost port.
# Adjust origins for production deployment.
# ─────────────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite default dev server
        "http://localhost:3000",   # CRA / alternative
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
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
# Health-check
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/", tags=["health"])
def root():
    return {
        "status": "ok",
        "service": "LAB Notebook API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
def health():
    return {"status": "healthy"}

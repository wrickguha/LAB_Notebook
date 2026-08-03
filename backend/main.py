from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base, SessionLocal
from app.db.init_db import init_db

# Import models to ensure all models are registered on Base
import app.models

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.projects import router as projects_router
from app.api.notebook import router as notebook_router
from app.api.resources import router as resources_router
from app.api.papers import router as papers_router
from app.api.audit import router as audit_router
from app.api.calculators import router as calculators_router
from app.api.notifications import router as notifications_router
from app.api.dashboard import router as dashboard_router

# Initialize database schema and default seed data
try:
    db = SessionLocal()
    init_db(db)
    db.close()
except Exception as e:
    print(f"[Main Init Warning] Could not auto-initialize DB tables on module load: {e}")

app = FastAPI(
    title="BioTech LAB Notebook API",
    version="1.0.0",
    description="Scalable REST backend with MySQL database integration and FDA 21 CFR Part 11 electronic records support."
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(notebook_router, prefix="/api")
app.include_router(resources_router, prefix="/api")
app.include_router(papers_router, prefix="/api")
app.include_router(audit_router, prefix="/api")
app.include_router(calculators_router, prefix="/api")
app.include_router(notifications_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "BioTech LAB Notebook API is online and healthy!", "version": "1.0.0"}

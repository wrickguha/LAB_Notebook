"""
Research Papers Router
  GET  /api/papers  — list all
  POST /api/papers  — add a new paper
"""

import time
from datetime import datetime
from typing import List

from fastapi import APIRouter
from app.database import db
from app.schemas import ResearchPaperOut, ResearchPaperCreate

router = APIRouter(prefix="/api/papers", tags=["papers"])


def _audit(action: str, target: str) -> None:
    db["audit_logs"].insert(0, {
        "id": f"log-{int(time.time() * 1000)}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "user": db["user"]["name"],
        "action": action,
        "target": target,
        "ip": "192.168.1.144",
        "status": "Compliant",
    })


@router.get("", response_model=List[ResearchPaperOut])
def list_papers():
    return db["research_papers"]


@router.post("", response_model=ResearchPaperOut, status_code=201)
def add_paper(body: ResearchPaperCreate):
    """
    Add a new reference paper to the repository.
    Mirrors addResearchPaper() in AppContext.jsx.
    """
    new_paper = {
        "id": f"paper-{int(time.time() * 1000)}",
        "title": body.title,
        "authors": body.authors,
        "journal": body.journal or "",
        "year": body.year or "2026",
        "doi": body.doi or "",
        "summary": body.summary or "",
        "tags": body.tags or [],
    }
    db["research_papers"].insert(0, new_paper)
    _audit("Upload Reference Paper", f"Paper Title: {body.title}")
    return new_paper

"""
Research Papers Router
  GET  /api/papers  — list all
  POST /api/papers  — add a new paper
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ResearchPaperOut, ResearchPaperCreate
import app.crud as crud

router = APIRouter(prefix="/api/papers", tags=["papers"])


@router.get("", response_model=List[ResearchPaperOut])
def list_papers(db: Session = Depends(get_db)):
    """List all research papers from database."""
    return crud.get_research_papers(db)


@router.post("", response_model=ResearchPaperOut, status_code=201)
def add_paper(body: ResearchPaperCreate, db: Session = Depends(get_db)):
    """
    Add a new reference paper to the repository.
    Mirrors addResearchPaper() in AppContext.jsx.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"

    return crud.create_research_paper(
        db=db,
        title=body.title,
        authors=body.authors,
        journal=body.journal,
        year=body.year,
        doi=body.doi,
        summary=body.summary,
        tags=body.tags or [],
        user_name=user_name
    )

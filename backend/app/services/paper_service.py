from sqlalchemy.orm import Session
from app.models.paper import ResearchPaper
from app.schemas.paper import PaperCreate

def list_papers(db: Session):
    papers = db.query(ResearchPaper).all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "authors": p.authors,
            "journal": p.journal,
            "year": p.year,
            "doi": p.doi,
            "abstract": p.abstract,
            "summary": p.summary or p.abstract,
            "tags": p.tags or []
        } for p in papers
    ]

def create_paper(db: Session, paper_in: PaperCreate):
    new_paper = ResearchPaper(
        title=paper_in.title,
        authors=paper_in.authors,
        journal=paper_in.journal,
        year=paper_in.year or "2026",
        doi=paper_in.doi,
        abstract=paper_in.abstract,
        summary=paper_in.summary or paper_in.abstract,
        tags=paper_in.tags or []
    )
    db.add(new_paper)
    db.commit()
    db.refresh(new_paper)
    return {
        "id": new_paper.id,
        "title": new_paper.title,
        "authors": new_paper.authors,
        "journal": new_paper.journal,
        "year": new_paper.year,
        "doi": new_paper.doi,
        "abstract": new_paper.abstract,
        "summary": new_paper.summary or new_paper.abstract,
        "tags": new_paper.tags or []
    }

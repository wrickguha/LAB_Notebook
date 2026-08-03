from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Any
from app.db.database import get_db
from app.models.user import User
from app.schemas.paper import PaperCreate
from app.api.deps import get_current_user
import app.services.paper_service as ps
from app.services.audit_service import add_audit_log
from app.schemas.audit_log import AuditLogCreate

router = APIRouter(prefix="/papers", tags=["papers"])

@router.get("", response_model=List[Any])
async def get_papers(db: Session = Depends(get_db)):
    return ps.list_papers(db)

@router.post("", response_model=Any)
async def create_paper(
    paper_in: PaperCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    paper = ps.create_paper(db, paper_in)
    add_audit_log(
        db,
        AuditLogCreate(
            action="New Paper Reference Uploaded",
            target=f"Paper: {paper['title']}"
        ),
        current_user
    )
    return paper

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.db.database import get_db
from app.models.user import User
from app.schemas.project import ProjectCreate
from app.api.deps import get_current_user
from app.services.project_service import list_projects, create_project, toggle_milestone
from app.services.audit_service import add_audit_log
from app.schemas.audit_log import AuditLogCreate

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("", response_model=List[Any])
async def get_projects(db: Session = Depends(get_db)):
    return list_projects(db)

@router.post("", response_model=Any)
async def add_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proj = create_project(db, project_in, current_user)
    add_audit_log(
        db,
        AuditLogCreate(
            action="New Project Initialized",
            target=f"Project: {proj['name']} ({proj['code']})"
        ),
        current_user
    )
    return proj

@router.patch("/{project_id}/milestones/{milestone_id}", response_model=Any)
async def update_milestone(
    project_id: str,
    milestone_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_proj = toggle_milestone(db, project_id, milestone_id, current_user)
    if not updated_proj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project or milestone not found"
        )
    return updated_proj

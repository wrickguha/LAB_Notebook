"""
Projects Router
  GET   /api/projects                                    — list all
  POST  /api/projects                                    — create project
  PATCH /api/projects/{project_id}/milestone/{milestone_id} — toggle milestone
"""

from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ProjectOut, ProjectCreate
import app.crud as crud

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=List[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    """List all research projects from database."""
    return crud.get_projects(db)


@router.post("", response_model=ProjectOut, status_code=201)
def create_project(body: ProjectCreate, db: Session = Depends(get_db)):
    """
    Create a new research project.
    Mirrors addProject() in AppContext.jsx.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"
    user_avatar = user.avatar if user else "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"

    milestones_list = [m.model_dump() for m in (body.milestones or [])]

    project = crud.create_project(
        db=db,
        name=body.name,
        code=body.code,
        description=body.description,
        status=body.status,
        banner=body.banner,
        milestones_data=milestones_list,
        user_name=user_name,
        user_avatar=user_avatar
    )
    return project


@router.patch("/{project_id}/milestone/{milestone_id}", response_model=ProjectOut)
def toggle_milestone(project_id: str, milestone_id: str, db: Session = Depends(get_db)):
    """
    Toggle a milestone's completed state and recalculate project progress.
    Mirrors toggleMilestone() in ProjectsPage.jsx.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"

    project = crud.toggle_project_milestone(db, project_id, milestone_id, user_name)
    if not project:
        raise HTTPException(status_code=404, detail="Project or Milestone not found")

    return project

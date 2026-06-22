"""
Projects Router
  GET   /api/projects                                    — list all
  POST  /api/projects                                    — create project
  PATCH /api/projects/{project_id}/milestone/{milestone_id} — toggle milestone
"""

import time
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException
from app.database import db
from app.schemas import ProjectOut, ProjectCreate, ProjectMilestone

router = APIRouter(prefix="/api/projects", tags=["projects"])


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


def _notify(title: str, message: str, notif_type: str = "info") -> None:
    db["_notification_counter"] += 1
    db["notifications"].insert(0, {
        "id": db["_notification_counter"],
        "title": title,
        "message": message,
        "time": "Just now",
        "read": False,
        "type": notif_type,
    })


@router.get("", response_model=List[ProjectOut])
def list_projects():
    return db["projects"]


@router.post("", response_model=ProjectOut, status_code=201)
def create_project(body: ProjectCreate):
    """
    Create a new research project.
    Mirrors addProject() in AppContext.jsx.
    """
    user = db["user"]
    new_id = f"proj-{int(time.time() * 1000)}"
    project = {
        "id": new_id,
        "name": body.name,
        "code": body.code,
        "description": body.description or "",
        "status": body.status or "Active",
        "progress": body.progress if body.progress is not None else 0,
        "members": [
            {"name": user["name"], "avatar": user["avatar"], "role": "Lead"}
        ],
        "milestones": [m.model_dump() for m in (body.milestones or [])],
        "banner": body.banner or "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800",
        "lastActivity": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    db["projects"].insert(0, project)
    _audit("Create Project", f"Project: {body.name}")
    _notify("Project Created", f"You initialized project {body.name} successfully.")
    return project


@router.patch("/{project_id}/milestone/{milestone_id}", response_model=ProjectOut)
def toggle_milestone(project_id: str, milestone_id: str):
    """
    Toggle a milestone's completed state and recalculate project progress.
    Mirrors toggleMilestone() in ProjectsPage.jsx.
    """
    project = next((p for p in db["projects"] if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    milestone = next((m for m in project["milestones"] if m["id"] == milestone_id), None)
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    milestone["completed"] = not milestone["completed"]

    completed_count = sum(1 for m in project["milestones"] if m["completed"])
    total = len(project["milestones"])
    project["progress"] = round((completed_count / total) * 100) if total > 0 else 0
    project["lastActivity"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    _audit("Toggle Milestone", f"Project: {project_id}, Milestone: {milestone_id}")
    return project

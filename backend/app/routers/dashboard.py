"""
Dashboard Router
  GET /api/dashboard/summary — KPI metrics for DashboardOverview.jsx
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import DashboardSummary
from app.models import Project, NotebookEntry, SharedResource, AuditLog

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_summary(db: Session = Depends(get_db)):
    """
    Compute and return the KPI counters rendered on DashboardOverview.jsx:
      - active_projects (non-Completed)
      - completed_projects
      - notebook_entries_total
      - notebook_in_review
      - shared_resources_total
      - audit_logs_total
    """
    active_projects = db.query(Project).filter(Project.status != "Completed").count()
    completed_projects = db.query(Project).filter(Project.status == "Completed").count()
    notebook_entries_total = db.query(NotebookEntry).count()
    notebook_in_review = db.query(NotebookEntry).filter(NotebookEntry.status == "In Review").count()
    shared_resources_total = db.query(SharedResource).count()
    audit_logs_total = db.query(AuditLog).count()

    return DashboardSummary(
        active_projects=active_projects,
        completed_projects=completed_projects,
        notebook_entries_total=notebook_entries_total,
        notebook_in_review=notebook_in_review,
        shared_resources_total=shared_resources_total,
        audit_logs_total=audit_logs_total,
    )

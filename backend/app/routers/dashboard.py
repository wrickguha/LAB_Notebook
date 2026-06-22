"""
Dashboard Router
  GET /api/dashboard/summary — KPI metrics for DashboardOverview.jsx
"""

from fastapi import APIRouter
from app.database import db
from app.schemas import DashboardSummary

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_summary():
    """
    Compute and return the KPI counters rendered on DashboardOverview.jsx:
      - active_projects (non-Completed)
      - completed_projects
      - notebook_entries_total
      - notebook_in_review
      - shared_resources_total
      - audit_logs_total
    """
    projects = db["projects"]
    notebooks = db["notebook_entries"]
    resources = db["shared_resources"]
    logs = db["audit_logs"]

    return DashboardSummary(
        active_projects=sum(1 for p in projects if p["status"] != "Completed"),
        completed_projects=sum(1 for p in projects if p["status"] == "Completed"),
        notebook_entries_total=len(notebooks),
        notebook_in_review=sum(1 for n in notebooks if n["status"] == "In Review"),
        shared_resources_total=len(resources),
        audit_logs_total=len(logs),
    )

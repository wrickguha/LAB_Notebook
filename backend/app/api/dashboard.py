from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.project import Project
from app.models.notebook import NotebookEntry
from app.models.resource import SharedResource
from app.models.audit_log import AuditLog

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary")
async def get_dashboard_summary(db: Session = Depends(get_db)):
    active_projects_count = db.query(Project).filter(Project.status == "Active").count()
    total_projects_count = db.query(Project).count()
    entries_count = db.query(NotebookEntry).count()
    approved_entries_count = db.query(NotebookEntry).filter(NotebookEntry.status == "Approved").count()
    resources_count = db.query(SharedResource).count()
    audit_logs_count = db.query(AuditLog).count()

    return {
        "success": True,
        "metrics": {
            "activeProjects": active_projects_count,
            "totalProjects": total_projects_count,
            "totalEntries": entries_count,
            "approvedEntries": approved_entries_count,
            "sharedResources": resources_count,
            "auditLogs": audit_logs_count
        }
    }

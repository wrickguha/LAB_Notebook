"""
Audit Logs Router
  GET  /api/audit-logs  — list all (supports search query param)
  POST /api/audit-logs  — manually create an audit log entry
"""

from typing import List, Optional
from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AuditLogOut, AuditLogCreate
import app.crud as crud

router = APIRouter(prefix="/api/audit-logs", tags=["audit-logs"])


@router.get("", response_model=List[AuditLogOut])
def list_audit_logs(
    q: Optional[str] = Query(None, description="Filter by action, target, or user"),
    db: Session = Depends(get_db)
):
    """
    Return all audit log entries, newest first from database.
    Optional ?q= query to search (mirrors SettingsPage.jsx compliance tab filter).
    """
    logs = crud.get_audit_logs(db)
    if q:
        q_lower = q.lower()
        logs = [
            log for log in logs
            if q_lower in log.action.lower()
            or q_lower in log.target.lower()
            or q_lower in log.user.lower()
        ]
    return logs


@router.post("", response_model=AuditLogOut, status_code=201)
def create_audit_log(body: AuditLogCreate, db: Session = Depends(get_db)):
    """
    Manually append an audit entry (e.g. from external integrations).
    Mirrors addAuditLog() in AppContext.jsx.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"

    return crud.log_audit(
        db=db,
        action=body.action,
        target=body.target,
        username=user_name,
        ip=body.ip or "192.168.1.144"
    )

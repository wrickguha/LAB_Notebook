"""
Audit Logs Router
  GET  /api/audit-logs  — list all (supports search query param)
  POST /api/audit-logs  — manually create an audit log entry
"""

import time
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Query
from app.database import db
from app.schemas import AuditLogOut, AuditLogCreate

router = APIRouter(prefix="/api/audit-logs", tags=["audit-logs"])


@router.get("", response_model=List[AuditLogOut])
def list_audit_logs(
    q: Optional[str] = Query(None, description="Filter by action, target, or user")
):
    """
    Return all audit log entries, newest first.
    Optional ?q= query to search (mirrors SettingsPage.jsx compliance tab filter).
    """
    logs = db["audit_logs"]
    if q:
        q_lower = q.lower()
        logs = [
            log for log in logs
            if q_lower in log["action"].lower()
            or q_lower in log["target"].lower()
            or q_lower in log["user"].lower()
        ]
    return logs


@router.post("", response_model=AuditLogOut, status_code=201)
def create_audit_log(body: AuditLogCreate):
    """
    Manually append an audit entry (e.g. from external integrations).
    Mirrors addAuditLog() in AppContext.jsx.
    """
    new_log = {
        "id": f"log-{int(time.time() * 1000)}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "user": db["user"]["name"],
        "action": body.action,
        "target": body.target,
        "ip": body.ip or "192.168.1.144",
        "status": "Compliant",
    }
    db["audit_logs"].insert(0, new_log)
    return new_log

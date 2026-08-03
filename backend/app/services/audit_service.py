from datetime import datetime
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLogCreate
from app.models.user import User

def list_audit_logs(db: Session, search: str | None = None):
    query = db.query(AuditLog).order_by(AuditLog.created_at.desc())
    if search:
        s = f"%{search}%"
        query = query.filter(
            (AuditLog.action.like(s)) |
            (AuditLog.target.like(s)) |
            (AuditLog.user_name.like(s))
        )
    logs = query.all()
    return [
        {
            "id": l.id,
            "action": l.action,
            "target": l.target,
            "user": l.user_name,
            "timestamp": l.timestamp
        } for l in logs
    ]

def add_audit_log(db: Session, log_in: AuditLogCreate, current_user: User | None = None):
    user_name = log_in.user or (current_user.full_name if current_user else "System")
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    new_log = AuditLog(
        action=log_in.action,
        target=log_in.target,
        user_name=user_name,
        timestamp=now_str
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return {
        "id": new_log.id,
        "action": new_log.action,
        "target": new_log.target,
        "user": new_log.user_name,
        "timestamp": new_log.timestamp
    }

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Any, Optional
from app.db.database import get_db
from app.models.user import User
from app.schemas.audit_log import AuditLogCreate
from app.api.deps import get_current_user
import app.services.audit_service as aus

router = APIRouter(prefix="/audit-logs", tags=["audit-logs"])

@router.get("", response_model=List[Any])
async def get_audit_logs(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return aus.list_audit_logs(db, search)

@router.post("", response_model=Any)
async def create_audit_log(
    log_in: AuditLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return aus.add_audit_log(db, log_in, current_user)

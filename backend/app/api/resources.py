from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.db.database import get_db
from app.models.user import User
from app.schemas.resource import ResourceCreate, PermissionUpdate
from app.api.deps import get_current_user
import app.services.resource_service as rs
from app.services.audit_service import add_audit_log
from app.schemas.audit_log import AuditLogCreate

router = APIRouter(prefix="/resources", tags=["resources"])

@router.get("", response_model=List[Any])
async def get_resources(db: Session = Depends(get_db)):
    return rs.list_resources(db)

@router.post("", response_model=Any)
async def create_resource(
    res_in: ResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = rs.create_resource(db, res_in, current_user)
    add_audit_log(
        db,
        AuditLogCreate(
            action="New Resource Registered",
            target=f"Resource: {res['name']}"
        ),
        current_user
    )
    return res

@router.patch("/{id}/permission", response_model=Any)
async def update_permission(
    id: str,
    perm_in: PermissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = rs.update_permission(db, id, perm_in, current_user)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    add_audit_log(
        db,
        AuditLogCreate(
            action="Resource Permission Updated",
            target=f"Resource {res['name']}: {perm_in.targetUser} set to {perm_in.newLevel}"
        ),
        current_user
    )
    return res

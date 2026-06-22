"""
Shared Resources Router
  GET   /api/resources                           — list all
  POST  /api/resources                           — share a new resource
  PATCH /api/resources/{resource_id}/permission  — update collaborator permission level
"""

from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import SharedResourceOut, SharedResourceCreate, PermissionUpdate
import app.crud as crud

router = APIRouter(prefix="/api/resources", tags=["resources"])


@router.get("", response_model=List[SharedResourceOut])
def list_resources(db: Session = Depends(get_db)):
    """List all shared resources from database."""
    return crud.get_shared_resources(db)


@router.post("", response_model=SharedResourceOut, status_code=201)
def create_resource(body: SharedResourceCreate, db: Session = Depends(get_db)):
    """
    Share a new resource node.
    Mirrors addSharedResource() in AppContext.jsx.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"

    return crud.create_shared_resource(
        db=db,
        name=body.name,
        type=body.type,
        owner=user_name,
        permission=body.permission,
        shared_with=body.sharedWith or [],
        user_name=user_name
    )


@router.patch("/{resource_id}/permission", response_model=SharedResourceOut)
def update_permission(
    resource_id: str,
    body: PermissionUpdate,
    db: Session = Depends(get_db)
):
    """
    Update the access level of a collaborator on a specific resource.
    Mirrors updateResourcePermission() in AppContext.jsx.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"

    resource = crud.update_resource_permission(
        db=db,
        resource_id=resource_id,
        target_user=body.targetUser,
        new_level=body.newLevel,
        user_name=user_name
    )
    if not resource:
        raise HTTPException(
            status_code=404,
            detail=f"Collaborator '{body.targetUser}' not found in this resource.",
        )
    return resource

"""
Shared Resources Router
  GET   /api/resources                           — list all
  POST  /api/resources                           — share a new resource
  PATCH /api/resources/{resource_id}/permission  — update collaborator permission level
"""

import time
from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException
from app.database import db
from app.schemas import SharedResourceOut, SharedResourceCreate, PermissionUpdate

router = APIRouter(prefix="/api/resources", tags=["resources"])


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


@router.get("", response_model=List[SharedResourceOut])
def list_resources():
    return db["shared_resources"]


@router.post("", response_model=SharedResourceOut, status_code=201)
def create_resource(body: SharedResourceCreate):
    """
    Share a new resource node.
    Mirrors addSharedResource() in AppContext.jsx.
    """
    new_res = {
        "id": f"res-{int(time.time() * 1000)}",
        "name": body.name,
        "type": body.type,
        "owner": db["user"]["name"],
        "permission": body.permission or "Owner",
        "sharedWith": body.sharedWith or [],
        "lastModified": datetime.now().strftime("%Y-%m-%d %H:%M"),
    }
    db["shared_resources"].insert(0, new_res)
    _audit(
        "Share Resource",
        f"Shared resource: {body.name} as {new_res['permission']}",
    )
    return new_res


@router.patch("/{resource_id}/permission", response_model=SharedResourceOut)
def update_permission(resource_id: str, body: PermissionUpdate):
    """
    Update the access level of a collaborator on a specific resource.
    Mirrors updateResourcePermission() in AppContext.jsx.
    """
    resource = next((r for r in db["shared_resources"] if r["id"] == resource_id), None)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    updated = False
    new_shared = []
    for entry in resource["sharedWith"]:
        name_part = entry.split(" (")[0]
        if name_part == body.targetUser:
            new_shared.append(f"{body.targetUser} ({body.newLevel})")
            updated = True
        else:
            new_shared.append(entry)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail=f"Collaborator '{body.targetUser}' not found in this resource.",
        )

    resource["sharedWith"] = new_shared
    resource["lastModified"] = datetime.now().strftime("%Y-%m-%d %H:%M")

    _audit(
        "Change Permission",
        f"Resource ID: {resource_id}, user {body.targetUser} set to {body.newLevel}",
    )
    return resource

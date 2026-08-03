from datetime import datetime
from sqlalchemy.orm import Session
from app.models.resource import SharedResource
from app.schemas.resource import ResourceCreate, PermissionUpdate
from app.models.user import User

def list_resources(db: Session):
    resources = db.query(SharedResource).all()
    return [
        {
            "id": r.id,
            "name": r.name,
            "type": r.type,
            "owner": r.owner,
            "permission": r.permission,
            "sharedWith": r.shared_with or [],
            "lastModified": r.last_modified
        } for r in resources
    ]

def create_resource(db: Session, res_in: ResourceCreate, current_user: User):
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    new_res = SharedResource(
        name=res_in.name,
        type=res_in.type or "Folder",
        owner=current_user.full_name,
        owner_id=current_user.id,
        permission=res_in.permission or "Owner",
        shared_with=res_in.sharedWith or [],
        last_modified=now_str
    )
    db.add(new_res)
    db.commit()
    db.refresh(new_res)
    return {
        "id": new_res.id,
        "name": new_res.name,
        "type": new_res.type,
        "owner": new_res.owner,
        "permission": new_res.permission,
        "sharedWith": new_res.shared_with or [],
        "lastModified": new_res.last_modified
    }

def update_permission(db: Session, resource_id: str, perm_in: PermissionUpdate, current_user: User):
    res = db.query(SharedResource).filter(SharedResource.id == resource_id).first()
    if not res:
        return None

    shared = res.shared_with or []
    updated_shared = []
    found = False
    for collab in shared:
        name = collab.split(" (")[0]
        if name == perm_in.targetUser:
            updated_shared.append(f"{perm_in.targetUser} ({perm_in.newLevel})")
            found = True
        else:
            updated_shared.append(collab)

    if not found:
        updated_shared.append(f"{perm_in.targetUser} ({perm_in.newLevel})")

    res.shared_with = updated_shared
    res.last_modified = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    db.commit()
    db.refresh(res)

    return {
        "id": res.id,
        "name": res.name,
        "type": res.type,
        "owner": res.owner,
        "permission": res.permission,
        "sharedWith": res.shared_with or [],
        "lastModified": res.last_modified
    }

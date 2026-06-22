"""
User Router — GET /api/user  |  PATCH /api/user
"""

from fastapi import APIRouter, HTTPException
from app.database import db
from app.schemas import UserOut, UserUpdate

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("", response_model=UserOut)
def get_user():
    """Return the current investigator profile."""
    return db["user"]


@router.patch("", response_model=UserOut)
def update_user(body: UserUpdate):
    """
    Partially update the user profile.
    Mirrors the setUser() call in SettingsPage.jsx.
    """
    updates = body.model_dump(exclude_none=True)
    db["user"].update(updates)

    # Audit trail
    import time
    from datetime import datetime
    db["audit_logs"].insert(0, {
        "id": f"log-{int(time.time() * 1000)}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "user": db["user"]["name"],
        "action": "Edit Profile Settings",
        "target": f"User: {db['user']['name']}",
        "ip": "192.168.1.144",
        "status": "Compliant",
    })
    return db["user"]

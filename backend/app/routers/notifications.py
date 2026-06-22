"""
Notifications Router
  GET  /api/notifications          — list all
  PATCH /api/notifications/mark-read — mark all as read
"""

from fastapi import APIRouter
from typing import List
from app.database import db
from app.schemas import NotificationOut

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=List[NotificationOut])
def get_notifications():
    """Return all notifications, most recent first."""
    return db["notifications"]


@router.patch("/mark-read")
def mark_all_read():
    """
    Mark every notification as read.
    Mirrors markNotificationsAsRead() in AppContext.jsx.
    """
    for n in db["notifications"]:
        n["read"] = True
    return {"success": True, "marked": len(db["notifications"])}

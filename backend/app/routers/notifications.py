"""
Notifications Router
  GET  /api/notifications          — list all
  PATCH /api/notifications/mark-read — mark all as read
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import NotificationOut
import app.crud as crud

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=List[NotificationOut])
def get_notifications(db: Session = Depends(get_db)):
    """Return all notifications, most recent first from database."""
    return crud.get_notifications(db)


@router.patch("/mark-read")
def mark_all_read(db: Session = Depends(get_db)):
    """
    Mark every notification as read.
    Mirrors markNotificationsAsRead() in AppContext.jsx.
    """
    crud.mark_notifications_read(db)
    return {"success": True}

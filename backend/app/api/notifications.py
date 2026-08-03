from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Any
from app.db.database import get_db
from app.models.user import User
from app.api.deps import get_current_user
import app.services.notification_service as ns

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("", response_model=List[Any])
async def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ns.list_notifications(db, current_user)

@router.post("/mark-read", response_model=Any)
async def mark_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ns.mark_notifications_read(db, current_user)

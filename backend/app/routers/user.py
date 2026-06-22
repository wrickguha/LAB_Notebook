"""
User Router — GET /api/user  |  PATCH /api/user
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserOut, UserUpdate
import app.crud as crud

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("", response_model=UserOut)
def get_user(db: Session = Depends(get_db)):
    """Return the current investigator profile from database."""
    user = crud.get_user(db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("", response_model=UserOut)
def update_user(body: UserUpdate, db: Session = Depends(get_db)):
    """
    Partially update the user profile.
    Mirrors the setUser() call in SettingsPage.jsx.
    """
    updates = body.model_dump(exclude_none=True)
    user = crud.update_user(db, updates)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

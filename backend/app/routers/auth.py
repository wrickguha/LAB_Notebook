"""
Auth Router — POST /api/auth/login  |  POST /api/auth/logout
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import LoginRequest, AuthResponse
import app.crud as crud

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """
    Simulated login — accepts any credentials.
    Writes login event to audit log database.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"
    crud.log_audit(db, "User Login", "Dashboard Session Started", user_name)
    return AuthResponse(success=True, message="Authenticated successfully.")


@router.post("/logout", response_model=AuthResponse)
def logout(db: Session = Depends(get_db)):
    """
    Simulated logout.
    Writes logout event to audit log database.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"
    crud.log_audit(db, "User Logout", "Dashboard Session Ended", user_name)
    return AuthResponse(success=True, message="Logged out successfully.")

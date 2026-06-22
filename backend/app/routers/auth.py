"""
Auth Router — POST /api/auth/login  |  POST /api/auth/logout
"""

from datetime import datetime
from fastapi import APIRouter
from app.database import db
from app.schemas import LoginRequest, AuthResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _add_audit(action: str, target: str) -> None:
    """Helper to append an audit log entry."""
    from datetime import datetime
    import time
    log = {
        "id": f"log-{int(time.time() * 1000)}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "user": db["user"]["name"],
        "action": action,
        "target": target,
        "ip": "192.168.1.144",
        "status": "Compliant",
    }
    db["audit_logs"].insert(0, log)


@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest):
    """
    Simulated login — accepts any credentials.
    In production, validate against a user store and return a JWT.
    """
    db["is_authenticated"] = True
    _add_audit("User Login", "Dashboard Session Started")
    return AuthResponse(success=True, message="Authenticated successfully.")


@router.post("/logout", response_model=AuthResponse)
def logout():
    db["is_authenticated"] = False
    _add_audit("User Logout", "Dashboard Session Ended")
    return AuthResponse(success=True, message="Logged out successfully.")

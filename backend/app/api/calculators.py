from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Any
from app.db.database import get_db
from app.models.user import User
from app.schemas.calculator import CalcHistoryCreate
from app.api.deps import get_current_user
import app.services.calculator_service as cs
from app.services.audit_service import add_audit_log
from app.schemas.audit_log import AuditLogCreate

router = APIRouter(prefix="/calculators", tags=["calculators"])

@router.get("/history", response_model=List[Any])
async def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return cs.list_calc_history(db, current_user)

@router.post("/history", response_model=Any)
async def create_history(
    calc_in: CalcHistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    calc = cs.create_calc_history(db, calc_in, current_user)
    add_audit_log(
        db,
        AuditLogCreate(
            action="Calculator Run Saved",
            target=f"{calc['type']}: {calc['input']}"
        ),
        current_user
    )
    return calc

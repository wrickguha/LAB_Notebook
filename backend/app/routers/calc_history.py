"""
Calculator History Router
  GET  /api/calc-history  — list all
  POST /api/calc-history  — add an entry
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import CalcHistoryOut, CalcHistoryCreate
import app.crud as crud

router = APIRouter(prefix="/api/calc-history", tags=["calculators"])


@router.get("", response_model=List[CalcHistoryOut])
def list_calc_history(db: Session = Depends(get_db)):
    """List all calculation history from database."""
    return crud.get_calc_history(db)


@router.post("", response_model=CalcHistoryOut, status_code=201)
def add_calc_history(body: CalcHistoryCreate, db: Session = Depends(get_db)):
    """
    Persist a calculator result into the history ledger.
    Mirrors addCalcHistory() in AppContext.jsx.
    """
    return crud.create_calc_history(
        db=db,
        type=body.type,
        formula=body.formula,
        input_str=body.input,
        result=body.result
    )

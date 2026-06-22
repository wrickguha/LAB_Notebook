"""
Calculator History Router
  GET  /api/calc-history  — list all
  POST /api/calc-history  — add an entry
"""

import time
from typing import List

from fastapi import APIRouter
from app.database import db
from app.schemas import CalcHistoryOut, CalcHistoryCreate

router = APIRouter(prefix="/api/calc-history", tags=["calculators"])


@router.get("", response_model=List[CalcHistoryOut])
def list_calc_history():
    return db["calc_history"]


@router.post("", response_model=CalcHistoryOut, status_code=201)
def add_calc_history(body: CalcHistoryCreate):
    """
    Persist a calculator result into the history ledger.
    Mirrors addCalcHistory() in AppContext.jsx.
    """
    db["_calc_counter"] += 1
    new_entry = {
        "id": db["_calc_counter"],
        "type": body.type,
        "formula": body.formula,
        "input": body.input,
        "result": body.result,
        "date": body.date or "Just now",
    }
    db["calc_history"].insert(0, new_entry)
    return new_entry

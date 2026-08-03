from datetime import datetime
from sqlalchemy.orm import Session
from app.models.calculator import CalcHistory
from app.schemas.calculator import CalcHistoryCreate
from app.models.user import User

def list_calc_history(db: Session, current_user: User | None = None):
    query = db.query(CalcHistory).order_by(CalcHistory.created_at.desc())
    if current_user:
        query = query.filter(CalcHistory.user_id == current_user.id)
    history = query.all()
    return [
        {
            "id": c.id,
            "type": c.type,
            "formula": c.formula,
            "input": c.input,
            "result": c.result,
            "date": c.date or c.timestamp,
            "timestamp": c.timestamp
        } for c in history
    ]

def create_calc_history(db: Session, calc_in: CalcHistoryCreate, current_user: User | None = None):
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    user_id = current_user.id if current_user else None

    new_calc = CalcHistory(
        type=calc_in.type,
        formula=calc_in.formula,
        input=calc_in.input,
        result=calc_in.result,
        date=calc_in.date or now_str,
        timestamp=now_str,
        user_id=user_id
    )
    db.add(new_calc)
    db.commit()
    db.refresh(new_calc)
    return {
        "id": new_calc.id,
        "type": new_calc.type,
        "formula": new_calc.formula,
        "input": new_calc.input,
        "result": new_calc.result,
        "date": new_calc.date,
        "timestamp": new_calc.timestamp
    }

from datetime import datetime
from sqlalchemy.orm import Session
from app.models.calculator import CalcHistory
from app.models.project import Project
from app.schemas.calculator import CalcHistoryCreate
from app.models.user import User

def list_calc_history(db: Session, current_user: User | None = None):
    query = db.query(CalcHistory).order_by(CalcHistory.created_at.desc())
    if current_user:
        query = query.filter(CalcHistory.user_id == current_user.id)
    history = query.all()
    
    # Get project names map if projects exist
    project_map = {}
    if history:
        project_ids = list(set([c.project_id for c in history if c.project_id]))
        if project_ids:
            projects = db.query(Project).filter(Project.id.in_(project_ids)).all()
            project_map = {p.id: p.name for p in projects}

    return [
        {
            "id": c.id,
            "type": c.type,
            "calculator_name": c.calculator_name or c.type,
            "formula": c.formula,
            "input": c.input,
            "result": c.result,
            "input_json": c.input_json,
            "output_json": c.output_json,
            "project_id": c.project_id,
            "project_name": project_map.get(c.project_id) if c.project_id else None,
            "date": c.date or c.timestamp,
            "timestamp": c.timestamp
        } for c in history
    ]

def create_calc_history(db: Session, calc_in: CalcHistoryCreate, current_user: User | None = None):
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    user_id = current_user.id if current_user else None

    new_calc = CalcHistory(
        type=calc_in.type,
        calculator_name=calc_in.calculator_name or calc_in.type,
        formula=calc_in.formula,
        input=calc_in.input,
        result=calc_in.result,
        input_json=calc_in.input_json,
        output_json=calc_in.output_json,
        project_id=calc_in.project_id,
        date=calc_in.date or now_str,
        timestamp=now_str,
        user_id=user_id
    )
    db.add(new_calc)
    db.commit()
    db.refresh(new_calc)

    project_name = None
    if new_calc.project_id:
        proj = db.query(Project).filter(Project.id == new_calc.project_id).first()
        if proj:
            project_name = proj.name

    return {
        "id": new_calc.id,
        "type": new_calc.type,
        "calculator_name": new_calc.calculator_name,
        "formula": new_calc.formula,
        "input": new_calc.input,
        "result": new_calc.result,
        "input_json": new_calc.input_json,
        "output_json": new_calc.output_json,
        "project_id": new_calc.project_id,
        "project_name": project_name,
        "date": new_calc.date,
        "timestamp": new_calc.timestamp
    }


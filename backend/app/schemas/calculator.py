from pydantic import BaseModel
from typing import Optional, Dict, Any

class CalcHistoryCreate(BaseModel):
    type: str
    calculator_name: Optional[str] = None
    formula: Optional[str] = None
    input: str
    result: str
    input_json: Optional[Dict[str, Any]] = None
    output_json: Optional[Dict[str, Any]] = None
    project_id: Optional[str] = None
    date: Optional[str] = None

class CalcHistoryResponse(BaseModel):
    id: str
    type: str
    calculator_name: Optional[str] = None
    formula: Optional[str] = None
    input: str
    result: str
    input_json: Optional[Dict[str, Any]] = None
    output_json: Optional[Dict[str, Any]] = None
    project_id: Optional[str] = None
    date: Optional[str] = None
    timestamp: str

    class Config:
        from_attributes = True


from pydantic import BaseModel
from typing import Optional

class CalcHistoryCreate(BaseModel):
    type: str
    formula: Optional[str] = None
    input: str
    result: str
    date: Optional[str] = None

class CalcHistoryResponse(BaseModel):
    id: str
    type: str
    formula: Optional[str] = None
    input: str
    result: str
    date: Optional[str] = None
    timestamp: str

    class Config:
        from_attributes = True

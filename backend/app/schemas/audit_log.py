from pydantic import BaseModel
from typing import Optional

class AuditLogCreate(BaseModel):
    action: str
    target: str
    user: Optional[str] = None

class AuditLogResponse(BaseModel):
    id: str
    action: str
    target: str
    user: str
    timestamp: str

    class Config:
        from_attributes = True

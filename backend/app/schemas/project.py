from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class MilestoneBase(BaseModel):
    name: str
    completed: Optional[bool] = False

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneResponse(MilestoneBase):
    id: str
    project_id: str

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    status: Optional[str] = "Active"
    progress: Optional[int] = 0
    banner: Optional[str] = None
    members: Optional[List[Dict[str, Any]]] = None

class ProjectCreate(ProjectBase):
    milestones: Optional[List[MilestoneCreate]] = None

class ProjectResponse(ProjectBase):
    id: str
    lastActivity: Optional[str] = None
    milestones: List[MilestoneResponse] = []

    class Config:
        from_attributes = True

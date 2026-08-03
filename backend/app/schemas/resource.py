from pydantic import BaseModel
from typing import List, Optional

class ResourceCreate(BaseModel):
    name: str
    type: Optional[str] = "Folder"
    permission: Optional[str] = "Owner"
    sharedWith: Optional[List[str]] = None

class PermissionUpdate(BaseModel):
    targetUser: str
    newLevel: str

class ResourceResponse(BaseModel):
    id: str
    name: str
    type: str
    owner: str
    permission: str
    sharedWith: List[str] = []
    lastModified: str

    class Config:
        from_attributes = True

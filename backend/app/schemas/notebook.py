from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class FolderCreate(BaseModel):
    name: str

class FolderResponse(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True

class EntryVersionResponse(BaseModel):
    id: str
    version: str
    user: str
    timestamp: str
    comment: Optional[str] = None

    class Config:
        from_attributes = True

class EntryCreate(BaseModel):
    folderId: str
    projectId: Optional[str] = ""
    title: Optional[str] = "Untitled Experiment Entry"
    content: Optional[str] = None
    tables: Optional[List[Dict[str, Any]]] = None
    attachments: Optional[List[Dict[str, Any]]] = None
    references: Optional[List[Dict[str, Any]]] = None

class EntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class EntryResponse(BaseModel):
    id: str
    folderId: str
    projectId: Optional[str] = ""
    title: str
    author: str
    date: str
    status: str
    content: Optional[str] = ""
    tables: List[Dict[str, Any]] = []
    attachments: List[Dict[str, Any]] = []
    references: List[Dict[str, Any]] = []
    versionHistory: List[EntryVersionResponse] = []

    class Config:
        from_attributes = True

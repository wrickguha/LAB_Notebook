from pydantic import BaseModel
from typing import List, Optional

class PaperCreate(BaseModel):
    title: str
    authors: str
    journal: Optional[str] = None
    year: Optional[str] = "2026"
    doi: Optional[str] = None
    abstract: Optional[str] = None
    summary: Optional[str] = None
    tags: Optional[List[str]] = None

class PaperResponse(BaseModel):
    id: str
    title: str
    authors: str
    journal: Optional[str] = None
    year: Optional[str] = None
    doi: Optional[str] = None
    abstract: Optional[str] = None
    summary: Optional[str] = None
    tags: List[str] = []

    class Config:
        from_attributes = True

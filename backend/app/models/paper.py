from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON
from app.db.database import Base

class ResearchPaper(Base):
    __tablename__ = "research_papers"

    id = Column(String(50), primary_key=True, default=lambda: f"paper-{int(datetime.utcnow().timestamp() * 1000)}", index=True)
    title = Column(String(500), nullable=False)
    authors = Column(String(500), nullable=False)
    journal = Column(String(255), nullable=True)
    year = Column(String(50), nullable=True)
    doi = Column(String(255), nullable=True)
    abstract = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True) # List of tag strings
    created_at = Column(DateTime, default=datetime.utcnow)

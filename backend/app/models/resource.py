from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from app.db.database import Base

class SharedResource(Base):
    __tablename__ = "shared_resources"

    id = Column(String(50), primary_key=True, default=lambda: f"res-{int(datetime.utcnow().timestamp() * 1000)}", index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False, default="Folder")
    owner = Column(String(255), nullable=False)
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    permission = Column(String(50), nullable=False, default="Owner")
    shared_with = Column(JSON, nullable=True)  # List of strings e.g. ["User Name (Role)"]
    last_modified = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

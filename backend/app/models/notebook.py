from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class NotebookFolder(Base):
    __tablename__ = "notebook_folders"

    id = Column(String(50), primary_key=True, default=lambda: f"folder-{int(datetime.utcnow().timestamp() * 1000)}", index=True)
    name = Column(String(255), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    entries = relationship("NotebookEntry", back_populates="folder", cascade="all, delete-orphan")

class NotebookEntry(Base):
    __tablename__ = "notebook_entries"

    id = Column(String(50), primary_key=True, default=lambda: f"note-{int(datetime.utcnow().timestamp() * 1000)}", index=True)
    folder_id = Column(String(50), ForeignKey("notebook_folders.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(50), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    date = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="Draft") # Draft | Approved
    content = Column(Text, nullable=True)
    tables = Column(JSON, nullable=True)       # list of tables
    attachments = Column(JSON, nullable=True)  # list of attachment objects
    references = Column(JSON, nullable=True)   # list of reference objects
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)

    folder = relationship("NotebookFolder", back_populates="entries")
    versions = relationship("EntryVersion", back_populates="entry", cascade="all, delete-orphan", order_by="EntryVersion.created_at")

class EntryVersion(Base):
    __tablename__ = "entry_versions"

    id = Column(String(50), primary_key=True, default=lambda: f"ver-{int(datetime.utcnow().timestamp() * 1000)}", index=True)
    entry_id = Column(String(50), ForeignKey("notebook_entries.id", ondelete="CASCADE"), nullable=False, index=True)
    version = Column(String(20), nullable=False) # e.g. v1.0, v1.1
    user_name = Column(String(255), nullable=False)
    timestamp = Column(String(100), nullable=False)
    comment = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    entry = relationship("NotebookEntry", back_populates="versions")

"""
SQLAlchemy ORM models for LAB Notebook.

Table layout:
  users
  notifications
  projects  →  project_members, project_milestones
  notebook_folders
  notebook_entries  →  note_attachments, note_tables, note_version_history, note_references
  shared_resources  →  shared_with_entries
  research_papers   →  paper_tags
  audit_logs
  calc_history
"""

from datetime import datetime, date as date_type
from typing import List

from sqlalchemy import (
    Boolean, Column, Date, DateTime, Float, ForeignKey,
    Integer, String, Text, JSON, func,
)
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


# ─────────────────────────────────────────────────────────────────────────────
# User
# ─────────────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id          = Column(Integer, primary_key=True, index=True, default=1)
    name        = Column(String(120), nullable=False)
    role        = Column(String(120), nullable=False)
    avatar      = Column(String(500), nullable=False)
    email       = Column(String(200), nullable=False, unique=True)
    institution = Column(String(200), nullable=False)
    lab         = Column(String(200), nullable=False)


# ─────────────────────────────────────────────────────────────────────────────
# Notifications
# ─────────────────────────────────────────────────────────────────────────────

class Notification(Base):
    __tablename__ = "notifications"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title       = Column(String(200), nullable=False)
    message     = Column(Text, nullable=False)
    time        = Column(String(60), nullable=False, default="Just now")
    read        = Column(Boolean, nullable=False, default=False)
    type        = Column(String(40), nullable=False, default="info")
    created_at  = Column(DateTime, server_default=func.now())


# ─────────────────────────────────────────────────────────────────────────────
# Projects
# ─────────────────────────────────────────────────────────────────────────────

class Project(Base):
    __tablename__ = "projects"

    id            = Column(String(40), primary_key=True)
    name          = Column(String(300), nullable=False)
    code          = Column(String(40), nullable=False)
    description   = Column(Text, nullable=False, default="")
    status        = Column(String(40), nullable=False, default="Active")
    progress      = Column(Integer, nullable=False, default=0)
    banner        = Column(String(500), nullable=False, default="")
    last_activity = Column(DateTime, nullable=False, default=datetime.utcnow)

    members    = relationship("ProjectMember",    back_populates="project", cascade="all, delete-orphan")
    milestones = relationship("ProjectMilestone", back_populates="project", cascade="all, delete-orphan")


class ProjectMember(Base):
    __tablename__ = "project_members"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(40), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name       = Column(String(120), nullable=False)
    avatar     = Column(String(500), nullable=False, default="")
    role       = Column(String(80), nullable=False, default="Member")

    project = relationship("Project", back_populates="members")


class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id         = Column(String(80), primary_key=True)
    project_id = Column(String(40), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name       = Column(String(300), nullable=False)
    completed  = Column(Boolean, nullable=False, default=False)

    project = relationship("Project", back_populates="milestones")


# ─────────────────────────────────────────────────────────────────────────────
# Notebook Folders & Entries
# ─────────────────────────────────────────────────────────────────────────────

class NotebookFolder(Base):
    __tablename__ = "notebook_folders"

    id   = Column(String(40), primary_key=True)
    name = Column(String(200), nullable=False)

    entries = relationship("NotebookEntry", back_populates="folder")


class NotebookEntry(Base):
    __tablename__ = "notebook_entries"

    id         = Column(String(40), primary_key=True)
    folder_id  = Column(String(40), ForeignKey("notebook_folders.id"), nullable=False)
    project_id = Column(String(40), ForeignKey("projects.id"), nullable=True)
    title      = Column(String(400), nullable=False)
    status     = Column(String(40), nullable=False, default="Draft")
    date       = Column(Date, nullable=False, default=date_type.today)
    author     = Column(String(120), nullable=False)
    content    = Column(Text, nullable=False, default="")

    folder          = relationship("NotebookFolder", back_populates="entries")
    attachments     = relationship("NoteAttachment",    back_populates="entry", cascade="all, delete-orphan")
    tables          = relationship("NoteTable",          back_populates="entry", cascade="all, delete-orphan")
    version_history = relationship("NoteVersionHistory", back_populates="entry", cascade="all, delete-orphan", order_by="NoteVersionHistory.id.desc()")
    references      = relationship("NoteReference",      back_populates="entry", cascade="all, delete-orphan")


class NoteAttachment(Base):
    __tablename__ = "note_attachments"

    id       = Column(Integer, primary_key=True, autoincrement=True)
    entry_id = Column(String(40), ForeignKey("notebook_entries.id", ondelete="CASCADE"), nullable=False)
    name     = Column(String(200), nullable=False)
    size     = Column(String(30), nullable=False)
    type     = Column(String(30), nullable=False)

    entry = relationship("NotebookEntry", back_populates="attachments")


class NoteTable(Base):
    __tablename__ = "note_tables"

    id       = Column(Integer, primary_key=True, autoincrement=True)
    entry_id = Column(String(40), ForeignKey("notebook_entries.id", ondelete="CASCADE"), nullable=False)
    headers  = Column(JSON, nullable=False, default=list)   # list[str]
    rows     = Column(JSON, nullable=False, default=list)   # list[list[str]]

    entry = relationship("NotebookEntry", back_populates="tables")


class NoteVersionHistory(Base):
    __tablename__ = "note_version_history"

    id        = Column(Integer, primary_key=True, autoincrement=True)
    entry_id  = Column(String(40), ForeignKey("notebook_entries.id", ondelete="CASCADE"), nullable=False)
    version   = Column(String(20), nullable=False)
    timestamp = Column(String(40), nullable=False)
    user      = Column(String(120), nullable=False)
    comment   = Column(String(400), nullable=False)

    entry = relationship("NotebookEntry", back_populates="version_history")


class NoteReference(Base):
    __tablename__ = "note_references"

    id       = Column(Integer, primary_key=True, autoincrement=True)
    entry_id = Column(String(40), ForeignKey("notebook_entries.id", ondelete="CASCADE"), nullable=False)
    citation = Column(Text, nullable=False)
    doi      = Column(String(200), nullable=False)

    entry = relationship("NotebookEntry", back_populates="references")


# ─────────────────────────────────────────────────────────────────────────────
# Shared Resources
# ─────────────────────────────────────────────────────────────────────────────

class SharedResource(Base):
    __tablename__ = "shared_resources"

    id            = Column(String(40), primary_key=True)
    name          = Column(String(300), nullable=False)
    type          = Column(String(60), nullable=False)
    owner         = Column(String(120), nullable=False)
    permission    = Column(String(40), nullable=False, default="Owner")
    last_modified = Column(String(40), nullable=False)

    shared_with = relationship("SharedWithEntry", back_populates="resource", cascade="all, delete-orphan")


class SharedWithEntry(Base):
    __tablename__ = "shared_with_entries"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    resource_id = Column(String(40), ForeignKey("shared_resources.id", ondelete="CASCADE"), nullable=False)
    entry       = Column(String(200), nullable=False)   # "Alex Rivera (Editor)"

    resource = relationship("SharedResource", back_populates="shared_with")


# ─────────────────────────────────────────────────────────────────────────────
# Research Papers
# ─────────────────────────────────────────────────────────────────────────────

class ResearchPaper(Base):
    __tablename__ = "research_papers"

    id      = Column(String(40), primary_key=True)
    title   = Column(String(600), nullable=False)
    authors = Column(Text, nullable=False)
    journal = Column(String(200), nullable=False, default="")
    year    = Column(String(10), nullable=False, default="")
    doi     = Column(String(200), nullable=False, default="")
    summary = Column(Text, nullable=False, default="")

    tags = relationship("PaperTag", back_populates="paper", cascade="all, delete-orphan")


class PaperTag(Base):
    __tablename__ = "paper_tags"

    id       = Column(Integer, primary_key=True, autoincrement=True)
    paper_id = Column(String(40), ForeignKey("research_papers.id", ondelete="CASCADE"), nullable=False)
    tag      = Column(String(80), nullable=False)

    paper = relationship("ResearchPaper", back_populates="tags")


# ─────────────────────────────────────────────────────────────────────────────
# Audit Logs
# ─────────────────────────────────────────────────────────────────────────────

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id        = Column(String(40), primary_key=True)
    timestamp = Column(String(40), nullable=False)
    user      = Column(String(120), nullable=False)
    action    = Column(String(200), nullable=False)
    target    = Column(String(400), nullable=False)
    ip        = Column(String(50), nullable=False, default="192.168.1.144")
    status    = Column(String(40), nullable=False, default="Compliant")


# ─────────────────────────────────────────────────────────────────────────────
# Calculator History
# ─────────────────────────────────────────────────────────────────────────────

class CalcHistory(Base):
    __tablename__ = "calc_history"

    id      = Column(Integer, primary_key=True, autoincrement=True)
    type    = Column(String(80), nullable=False)
    formula = Column(String(200), nullable=False)
    input   = Column(Text, nullable=False)
    result  = Column(Text, nullable=False)
    date    = Column(String(60), nullable=False, default="Just now")

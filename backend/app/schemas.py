"""
Pydantic schemas for all API request / response models.
Mirrors the data shapes in the React AppContext.jsx exactly.
"""

from __future__ import annotations

from typing import Any, List, Optional
from pydantic import BaseModel, EmailStr


# ─────────────────────────────────────────────────────────────────────────────
# Auth
# ─────────────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str = "evelyn.thorne@labnotebook.ai"
    password: str = "demo"


class AuthResponse(BaseModel):
    success: bool
    message: str


# ─────────────────────────────────────────────────────────────────────────────
# User / Profile
# ─────────────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    name: str
    role: str
    avatar: str
    email: str
    institution: str
    lab: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    avatar: Optional[str] = None
    email: Optional[str] = None
    institution: Optional[str] = None
    lab: Optional[str] = None


# ─────────────────────────────────────────────────────────────────────────────
# Notifications
# ─────────────────────────────────────────────────────────────────────────────

class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    time: str
    read: bool
    type: str


# ─────────────────────────────────────────────────────────────────────────────
# Projects
# ─────────────────────────────────────────────────────────────────────────────

class ProjectMember(BaseModel):
    name: str
    avatar: str
    role: str


class ProjectMilestone(BaseModel):
    id: str
    name: str
    completed: bool


class ProjectOut(BaseModel):
    id: str
    name: str
    code: str
    description: str
    status: str
    progress: int
    members: List[ProjectMember]
    milestones: List[ProjectMilestone]
    banner: str
    lastActivity: str


class ProjectCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = ""
    status: Optional[str] = "Active"
    milestones: Optional[List[ProjectMilestone]] = []
    banner: Optional[str] = "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800"
    progress: Optional[int] = 0


# ─────────────────────────────────────────────────────────────────────────────
# Notebook Folders
# ─────────────────────────────────────────────────────────────────────────────

class NotebookFolderOut(BaseModel):
    id: str
    name: str


class NotebookFolderCreate(BaseModel):
    name: str


# ─────────────────────────────────────────────────────────────────────────────
# Notebook Entries
# ─────────────────────────────────────────────────────────────────────────────

class NoteAttachment(BaseModel):
    name: str
    size: str
    type: str


class NoteTable(BaseModel):
    headers: List[str]
    rows: List[List[str]]


class NoteVersionEntry(BaseModel):
    version: str
    timestamp: str
    user: str
    comment: str


class NoteReference(BaseModel):
    citation: str
    doi: str


class NotebookEntryOut(BaseModel):
    id: str
    folderId: str
    projectId: str
    title: str
    status: str
    date: str
    author: str
    content: str
    attachments: List[NoteAttachment]
    tables: List[NoteTable]
    versionHistory: List[NoteVersionEntry]
    references: List[NoteReference]


class NotebookEntryCreate(BaseModel):
    folderId: str
    projectId: str
    title: str
    status: Optional[str] = "Draft"
    content: Optional[str] = ""


class NotebookEntryContentUpdate(BaseModel):
    content: str
    title: Optional[str] = None


# ─────────────────────────────────────────────────────────────────────────────
# Shared Resources
# ─────────────────────────────────────────────────────────────────────────────

class SharedResourceOut(BaseModel):
    id: str
    name: str
    type: str
    owner: str
    permission: str
    sharedWith: List[str]
    lastModified: str


class SharedResourceCreate(BaseModel):
    name: str
    type: str
    permission: Optional[str] = "Owner"
    sharedWith: Optional[List[str]] = []


class PermissionUpdate(BaseModel):
    targetUser: str
    newLevel: str


# ─────────────────────────────────────────────────────────────────────────────
# Research Papers
# ─────────────────────────────────────────────────────────────────────────────

class ResearchPaperOut(BaseModel):
    id: str
    title: str
    authors: str
    journal: str
    year: str
    doi: str
    summary: str
    tags: List[str]


class ResearchPaperCreate(BaseModel):
    title: str
    authors: str
    journal: Optional[str] = ""
    year: Optional[str] = "2026"
    doi: Optional[str] = ""
    summary: Optional[str] = ""
    tags: Optional[List[str]] = []


# ─────────────────────────────────────────────────────────────────────────────
# Audit Logs
# ─────────────────────────────────────────────────────────────────────────────

class AuditLogOut(BaseModel):
    id: str
    timestamp: str
    user: str
    action: str
    target: str
    ip: str
    status: str


class AuditLogCreate(BaseModel):
    action: str
    target: str
    ip: Optional[str] = "192.168.1.144"


# ─────────────────────────────────────────────────────────────────────────────
# Calculator History
# ─────────────────────────────────────────────────────────────────────────────

class CalcHistoryOut(BaseModel):
    id: int
    type: str
    formula: str
    input: str
    result: str
    date: str


class CalcHistoryCreate(BaseModel):
    type: str
    formula: str
    input: str
    result: str
    date: Optional[str] = "Just now"


# ─────────────────────────────────────────────────────────────────────────────
# Calculator Request / Response schemas
# ─────────────────────────────────────────────────────────────────────────────

class MolarityRequest(BaseModel):
    mass: float          # grams
    molecular_weight: float  # g/mol
    volume_ml: float     # millilitres


class MolarityResponse(BaseModel):
    molarity: float      # mol / L
    formatted: str


class DnaCopyRequest(BaseModel):
    amount_ng: float
    length_bp: float


class DnaCopyResponse(BaseModel):
    copies_scientific: str
    copies_float: float


class PcrComponent(BaseModel):
    name: str
    perRxn: float
    total: float
    unit: str


class PcrMixRequest(BaseModel):
    reactions: int
    overage_percent: Optional[float] = 10.0


class PcrMixResponse(BaseModel):
    multiplier: float
    total_volume: float
    components: List[PcrComponent]


class HalfLifeRequest(BaseModel):
    initial_amount: float   # grams
    half_life_hours: float
    elapsed_hours: float


class HalfLifeResponse(BaseModel):
    remaining: float
    decayed: float
    percentage: float


class StatisticsRequest(BaseModel):
    values: List[float]


class StatisticsResponse(BaseModel):
    count: int
    mean: float
    variance: float
    std_dev: float
    minimum: float
    maximum: float


# ─────────────────────────────────────────────────────────────────────────────
# Analytics
# ─────────────────────────────────────────────────────────────────────────────

class ProductivityDataPoint(BaseModel):
    day: str
    lab_hours: int
    data_entries: int


class ResourceAllocationItem(BaseModel):
    name: str
    hours: int
    cost: int


class PipelineStatItem(BaseModel):
    name: str
    drafts: int
    reviews: int
    signed: int


class AnalyticsProductivityResponse(BaseModel):
    data: List[ProductivityDataPoint]


class AnalyticsResourcesResponse(BaseModel):
    data: List[ResourceAllocationItem]


class AnalyticsPipelineResponse(BaseModel):
    data: List[PipelineStatItem]


# ─────────────────────────────────────────────────────────────────────────────
# Dashboard Summary
# ─────────────────────────────────────────────────────────────────────────────

class DashboardSummary(BaseModel):
    active_projects: int
    completed_projects: int
    notebook_entries_total: int
    notebook_in_review: int
    shared_resources_total: int
    audit_logs_total: int

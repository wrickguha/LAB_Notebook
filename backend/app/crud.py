"""
CRUD (Create, Read, Update, Delete) operations for LAB Notebook.
"""

import time
from datetime import datetime, date as date_type
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session, joinedload

from app.models import (
    User, Notification, Project, ProjectMember, ProjectMilestone,
    NotebookFolder, NotebookEntry, NoteAttachment, NoteTable, NoteVersionHistory,
    NoteReference, SharedResource, SharedWithEntry, ResearchPaper, PaperTag,
    AuditLog, CalcHistory
)

# ─────────────────────────────────────────────────────────────────────────────
# Serialization Converters
# ─────────────────────────────────────────────────────────────────────────────

def project_to_dict(p: Project) -> Dict[str, Any]:
    """Convert Project ORM model to dictionary matching ProjectOut schema."""
    last_act = ""
    if p.last_activity:
        # Format ISO with Z to match frontend
        last_act = p.last_activity.strftime("%Y-%m-%dT%H:%M:%S") + "Z"

    return {
        "id": p.id,
        "name": p.name,
        "code": p.code,
        "description": p.description or "",
        "status": p.status or "Active",
        "progress": p.progress or 0,
        "banner": p.banner or "",
        "lastActivity": last_act,
        "members": [
            {
                "name": m.name,
                "avatar": m.avatar,
                "role": m.role
            } for m in p.members
        ],
        "milestones": [
            {
                "id": ms.id,
                "name": ms.name,
                "completed": ms.completed
            } for ms in p.milestones
        ]
    }


def entry_to_dict(e: NotebookEntry) -> Dict[str, Any]:
    """Convert NotebookEntry ORM model to dictionary matching NotebookEntryOut schema."""
    return {
        "id": e.id,
        "folderId": e.folder_id,
        "projectId": e.project_id or "",
        "title": e.title,
        "status": e.status,
        "date": e.date.isoformat() if e.date else "",
        "author": e.author,
        "content": e.content or "",
        "attachments": [
            {
                "name": att.name,
                "size": att.size,
                "type": att.type
            } for att in e.attachments
        ],
        "tables": [
            {
                "headers": tbl.headers,
                "rows": tbl.rows
            } for tbl in e.tables
        ],
        "versionHistory": [
            {
                "version": v.version,
                "timestamp": v.timestamp,
                "user": v.user,
                "comment": v.comment
            } for v in e.version_history
        ],
        "references": [
            {
                "citation": r.citation,
                "doi": r.doi
            } for r in e.references
        ]
    }


def resource_to_dict(r: SharedResource) -> Dict[str, Any]:
    """Convert SharedResource ORM model to dictionary matching SharedResourceOut schema."""
    return {
        "id": r.id,
        "name": r.name,
        "type": r.type,
        "owner": r.owner,
        "permission": r.permission,
        "sharedWith": [sw.entry for sw in r.shared_with],
        "lastModified": r.last_modified
    }


def paper_to_dict(rp: ResearchPaper) -> Dict[str, Any]:
    """Convert ResearchPaper ORM model to dictionary matching ResearchPaperOut schema."""
    return {
        "id": rp.id,
        "title": rp.title,
        "authors": rp.authors,
        "journal": rp.journal or "",
        "year": rp.year or "",
        "doi": rp.doi or "",
        "summary": rp.summary or "",
        "tags": [t.tag for t in rp.tags]
    }


# ─────────────────────────────────────────────────────────────────────────────
# Audit & Notification Helpers
# ─────────────────────────────────────────────────────────────────────────────

def log_audit(db: Session, action: str, target: str, username: str, ip: str = "192.168.1.144") -> AuditLog:
    """Create an audit log entry (internal helper)."""
    log_id = f"log-{int(time.time() * 1000)}"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_log = AuditLog(
        id=log_id,
        timestamp=timestamp,
        user=username,
        action=action,
        target=target,
        ip=ip,
        status="Compliant"
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def create_notification(db: Session, title: str, message: str, notif_type: str = "info") -> Notification:
    """Create a system notification (internal helper)."""
    db_notif = Notification(
        title=title,
        message=message,
        time="Just now",
        read=False,
        type=notif_type
    )
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif


# ─────────────────────────────────────────────────────────────────────────────
# User Profile
# ─────────────────────────────────────────────────────────────────────────────

def get_user(db: Session) -> Optional[User]:
    """Retrieve user with ID 1 (default user)."""
    return db.query(User).filter(User.id == 1).first()


def update_user(db: Session, updates: dict) -> Optional[User]:
    """Update investigator profile."""
    user = get_user(db)
    if not user:
        return None
    for key, value in updates.items():
        if hasattr(user, key):
            setattr(user, key, value)
    db.commit()
    db.refresh(user)

    # Log to audit trail
    log_audit(db, "Edit Profile Settings", f"User: {user.name}", user.name)

    return user


# ─────────────────────────────────────────────────────────────────────────────
# Notifications
# ─────────────────────────────────────────────────────────────────────────────

def get_notifications(db: Session) -> List[Notification]:
    """List notifications, newest first."""
    return db.query(Notification).order_by(Notification.id.desc()).all()


def mark_notifications_read(db: Session) -> bool:
    """Mark all notifications as read."""
    db.query(Notification).filter(Notification.read == False).update({"read": True})
    db.commit()
    return True


# ─────────────────────────────────────────────────────────────────────────────
# Projects
# ─────────────────────────────────────────────────────────────────────────────

def get_projects(db: Session) -> List[Dict[str, Any]]:
    """List all projects with pre-fetched members and milestones, serialized."""
    projects = (
        db.query(Project)
        .options(
            joinedload(Project.members),
            joinedload(Project.milestones)
        )
        .order_by(Project.last_activity.desc())
        .all()
    )
    return [project_to_dict(p) for p in projects]


def create_project(db: Session, name: str, code: str, description: str, status: str, banner: str, milestones_data: list, user_name: str, user_avatar: str) -> Dict[str, Any]:
    """Create a new research project."""
    project_id = f"proj-{int(time.time() * 1000)}"
    db_project = Project(
        id=project_id,
        name=name,
        code=code,
        description=description or "",
        status=status or "Active",
        progress=0,
        banner=banner or "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800",
        last_activity=datetime.utcnow()
    )
    db.add(db_project)

    # Add creator as Lead member
    lead_member = ProjectMember(
        project_id=project_id,
        name=user_name,
        avatar=user_avatar,
        role="Lead"
    )
    db.add(lead_member)

    # Add milestones
    for m in milestones_data:
        milestone = ProjectMilestone(
            id=m.get("id") or f"m-{int(time.time() * 1000)}-{hash(m['name']) % 1000}",
            project_id=project_id,
            name=m["name"],
            completed=m.get("completed", False)
        )
        db.add(milestone)

    db.commit()
    db.refresh(db_project)

    # Audit & Notification
    log_audit(db, "Create Project", f"Project: {name}", user_name)
    create_notification(db, "Project Created", f"You initialized project {name} successfully.", "info")

    return project_to_dict(db_project)


def toggle_project_milestone(db: Session, project_id: str, milestone_id: str, user_name: str) -> Optional[Dict[str, Any]]:
    """Toggle a milestone's completed state and recalculate project progress."""
    project = (
        db.query(Project)
        .options(joinedload(Project.milestones), joinedload(Project.members))
        .filter(Project.id == project_id)
        .first()
    )
    if not project:
        return None

    milestone = next((m for m in project.milestones if m.id == milestone_id), None)
    if not milestone:
        return None

    milestone.completed = not milestone.completed

    # Recalculate progress percentage
    completed_count = sum(1 for m in project.milestones if m.completed)
    total = len(project.milestones)
    project.progress = round((completed_count / total) * 100) if total > 0 else 0
    project.last_activity = datetime.utcnow()

    db.commit()
    db.refresh(project)

    # Audit
    log_audit(db, "Toggle Milestone", f"Project: {project_id}, Milestone: {milestone_id}", user_name)

    return project_to_dict(project)


# ─────────────────────────────────────────────────────────────────────────────
# Notebook Folders & Entries
# ─────────────────────────────────────────────────────────────────────────────

def get_notebook_folders(db: Session) -> List[NotebookFolder]:
    """List all folders."""
    return db.query(NotebookFolder).all()


def create_notebook_folder(db: Session, name: str, user_name: str) -> NotebookFolder:
    """Create a folder."""
    folder_id = f"folder-{int(time.time() * 1000)}"
    db_folder = NotebookFolder(id=folder_id, name=name)
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)

    # Audit
    log_audit(db, "Create Folder", f"Folder: {name}", user_name)

    return db_folder


def get_notebook_entries(db: Session, folder_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """List all notebook entries with nested tables, history, etc."""
    query = db.query(NotebookEntry).options(
        joinedload(NotebookEntry.folder),
        joinedload(NotebookEntry.attachments),
        joinedload(NotebookEntry.tables),
        joinedload(NotebookEntry.version_history),
        joinedload(NotebookEntry.references)
    )
    if folder_id:
        query = query.filter(NotebookEntry.folder_id == folder_id)

    # Order by date desc, then by id desc to match latest first
    entries = query.order_by(NotebookEntry.date.desc(), NotebookEntry.id.desc()).all()
    return [entry_to_dict(e) for e in entries]


def get_notebook_entry(db: Session, entry_id: str) -> Optional[Dict[str, Any]]:
    """Get single entry by ID."""
    entry = (
        db.query(NotebookEntry)
        .options(
            joinedload(NotebookEntry.folder),
            joinedload(NotebookEntry.attachments),
            joinedload(NotebookEntry.tables),
            joinedload(NotebookEntry.version_history),
            joinedload(NotebookEntry.references)
        )
        .filter(NotebookEntry.id == entry_id)
        .first()
    )
    return entry_to_dict(entry) if entry else None


def create_notebook_entry(db: Session, folder_id: str, project_id: str, title: str, status: str, content: str, user_name: str) -> Dict[str, Any]:
    """Create a new notebook entry draft."""
    entry_id = f"note-{int(time.time() * 1000)}"
    db_entry = NotebookEntry(
        id=entry_id,
        folder_id=folder_id,
        project_id=project_id,
        title=title,
        status=status or "Draft",
        date=date_type.today(),
        author=user_name,
        content=content or ""
    )
    db.add(db_entry)

    # Initial version history entry
    hist = NoteVersionHistory(
        entry_id=entry_id,
        version="v1.0",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M"),
        user=user_name,
        comment="Document created"
    )
    db.add(hist)

    db.commit()
    db.refresh(db_entry)

    # Audit & Notification
    log_audit(db, "Create Notebook Entry", f"Notebook Entry: {title}", user_name)
    create_notification(db, "Notebook Entry Added", f"New experiment log \"{title}\" has been drafted.", "info")

    return entry_to_dict(db_entry)


def update_notebook_entry_content(db: Session, entry_id: str, content: str, title: Optional[str], user_name: str) -> Optional[Dict[str, Any]]:
    """Update entry content and append a new version entry."""
    entry = (
        db.query(NotebookEntry)
        .options(
            joinedload(NotebookEntry.attachments),
            joinedload(NotebookEntry.tables),
            joinedload(NotebookEntry.version_history),
            joinedload(NotebookEntry.references)
        )
        .filter(NotebookEntry.id == entry_id)
        .first()
    )
    if not entry:
        return None

    if entry.status == "Approved":
        # Cannot edit approved entries (21 CFR compliant lock)
        return entry_to_dict(entry)

    entry.content = content
    if title:
        entry.title = title

    # Calculate version code based on version history length
    v_count = db.query(NoteVersionHistory).filter(NoteVersionHistory.entry_id == entry_id).count()
    new_version = f"v1.{v_count}"

    hist = NoteVersionHistory(
        entry_id=entry_id,
        version=new_version,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M"),
        user=user_name,
        comment="Content updated in editor"
    )
    db.add(hist)

    db.commit()
    db.refresh(entry)

    # Audit
    log_audit(db, "Edit Document Content", f"Notebook ID: {entry_id}", user_name)

    return entry_to_dict(entry)


def approve_notebook_entry(db: Session, entry_id: str, user_name: str) -> Optional[Dict[str, Any]]:
    """Digitally sign and approve an entry."""
    entry = (
        db.query(NotebookEntry)
        .options(
            joinedload(NotebookEntry.attachments),
            joinedload(NotebookEntry.tables),
            joinedload(NotebookEntry.version_history),
            joinedload(NotebookEntry.references)
        )
        .filter(NotebookEntry.id == entry_id)
        .first()
    )
    if not entry:
        return None

    entry.status = "Approved"

    db.commit()
    db.refresh(entry)

    # Audit & Notification
    log_audit(db, "Digital Signature Applied", f"Signed and Approved Notebook ID: {entry_id}", user_name)
    create_notification(db, "Experiment Approved", f"Your digital signature is finalized on document ID {entry_id}.", "approval")

    return entry_to_dict(entry)


# ─────────────────────────────────────────────────────────────────────────────
# Shared Resources
# ─────────────────────────────────────────────────────────────────────────────

def get_shared_resources(db: Session) -> List[Dict[str, Any]]:
    """List shared resources."""
    resources = (
        db.query(SharedResource)
        .options(joinedload(SharedResource.shared_with))
        .all()
    )
    return [resource_to_dict(r) for r in resources]


def create_shared_resource(db: Session, name: str, type: str, owner: str, permission: str, shared_with: List[str], user_name: str) -> Dict[str, Any]:
    """Share a new resource."""
    resource_id = f"res-{int(time.time() * 1000)}"
    db_res = SharedResource(
        id=resource_id,
        name=name,
        type=type,
        owner=owner,
        permission=permission or "Owner",
        last_modified=datetime.now().strftime("%Y-%m-%d %H:%M")
    )
    db.add(db_res)

    for entry_str in shared_with:
        db.add(SharedWithEntry(
            resource_id=resource_id,
            entry=entry_str
        ))

    db.commit()
    db.refresh(db_res)

    # Audit
    log_audit(db, "Share Resource", f"Shared resource: {name} as {permission}", user_name)

    return resource_to_dict(db_res)


def update_resource_permission(db: Session, resource_id: str, target_user: str, new_level: str, user_name: str) -> Optional[Dict[str, Any]]:
    """Update the permission mapping for a specific user on a shared resource."""
    resource = (
        db.query(SharedResource)
        .options(joinedload(SharedResource.shared_with))
        .filter(SharedResource.id == resource_id)
        .first()
    )
    if not resource:
        return None

    # Search for sharedWith entry that starts with target_user name
    found = False
    for sw in resource.shared_with:
        if sw.entry.startswith(target_user):
            sw.entry = f"{target_user} ({new_level})"
            found = True
            break

    if not found:
        # If user wasn't in the list, append them
        db.add(SharedWithEntry(
            resource_id=resource_id,
            entry=f"{target_user} ({new_level})"
        ))

    resource.last_modified = datetime.now().strftime("%Y-%m-%d %H:%M")
    db.commit()
    db.refresh(resource)

    # Audit
    log_audit(db, "Change Permission", f"Resource ID: {resource_id}, user {target_user} set to {new_level}", user_name)

    return resource_to_dict(resource)


# ─────────────────────────────────────────────────────────────────────────────
# Research Papers
# ─────────────────────────────────────────────────────────────────────────────

def get_research_papers(db: Session) -> List[Dict[str, Any]]:
    """List research papers."""
    papers = (
        db.query(ResearchPaper)
        .options(joinedload(ResearchPaper.tags))
        .all()
    )
    return [paper_to_dict(rp) for rp in papers]


def create_research_paper(db: Session, title: str, authors: str, journal: str, year: str, doi: str, summary: str, tags: List[str], user_name: str) -> Dict[str, Any]:
    """Create reference paper entry."""
    paper_id = f"paper-{int(time.time() * 1000)}"
    db_paper = ResearchPaper(
        id=paper_id,
        title=title,
        authors=authors,
        journal=journal or "",
        year=year or "2026",
        doi=doi or "",
        summary=summary or ""
    )
    db.add(db_paper)

    for t in tags:
        db.add(PaperTag(
            paper_id=paper_id,
            tag=t
        ))

    db.commit()
    db.refresh(db_paper)

    # Audit
    log_audit(db, "Upload Reference Paper", f"Paper Title: {title}", user_name)

    return paper_to_dict(db_paper)


# ─────────────────────────────────────────────────────────────────────────────
# Audit Logs
# ─────────────────────────────────────────────────────────────────────────────

def get_audit_logs(db: Session) -> List[AuditLog]:
    """List audit trail entries, ordered by timestamp/ID desc."""
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc(), AuditLog.id.desc()).all()


# ─────────────────────────────────────────────────────────────────────────────
# Calculator History
# ─────────────────────────────────────────────────────────────────────────────

def get_calc_history(db: Session) -> List[CalcHistory]:
    """List calculation history, ordered by ID desc."""
    return db.query(CalcHistory).order_by(CalcHistory.id.desc()).all()


def create_calc_history(db: Session, type: str, formula: str, input_str: str, result: str) -> CalcHistory:
    """Save a calculation result to history."""
    db_calc = CalcHistory(
        type=type,
        formula=formula,
        input=input_str,
        result=result,
        date=datetime.now().strftime("%B %d, %H:%M")  # e.g., "June 4, 16:30"
    )
    db.add(db_calc)
    db.commit()
    db.refresh(db_calc)
    return db_calc

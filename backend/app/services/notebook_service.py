from datetime import datetime
from sqlalchemy.orm import Session
from app.models.notebook import NotebookFolder, NotebookEntry, EntryVersion
from app.schemas.notebook import EntryCreate, EntryUpdate
from app.models.user import User

def format_entry_response(entry: NotebookEntry):
    versions = [
        {
            "id": v.id,
            "version": v.version,
            "user": v.user_name,
            "timestamp": v.timestamp,
            "comment": v.comment
        } for v in entry.versions
    ]
    return {
        "id": entry.id,
        "folderId": entry.folder_id,
        "projectId": entry.project_id or "",
        "title": entry.title,
        "author": entry.author,
        "date": entry.date,
        "status": entry.status,
        "content": entry.content or "",
        "tables": entry.tables or [],
        "attachments": entry.attachments or [],
        "references": entry.references or [],
        "versionHistory": versions
    }

def list_folders(db: Session):
    folders = db.query(NotebookFolder).all()
    return [{"id": f.id, "name": f.name} for f in folders]

def create_folder(db: Session, name: str, current_user: User):
    folder = NotebookFolder(name=name, user_id=current_user.id)
    db.add(folder)
    db.commit()
    db.refresh(folder)
    return {"id": folder.id, "name": folder.name}

def list_entries(db: Session, folder_id: str | None = None):
    query = db.query(NotebookEntry)
    if folder_id:
        query = query.filter(NotebookEntry.folder_id == folder_id)
    entries = query.all()
    return [format_entry_response(e) for e in entries]

def get_entry(db: Session, entry_id: str):
    entry = db.query(NotebookEntry).filter(NotebookEntry.id == entry_id).first()
    if not entry:
        return None
    return format_entry_response(entry)

def create_entry(db: Session, entry_in: EntryCreate, current_user: User):
    today = datetime.utcnow().strftime("%Y-%m-%d")
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M")

    new_entry = NotebookEntry(
        folder_id=entry_in.folderId,
        project_id=entry_in.projectId or "",
        user_id=current_user.id,
        title=entry_in.title or "Untitled Experiment Entry",
        author=current_user.full_name,
        date=today,
        status="Draft",
        content=entry_in.content or "### Objective\n\n### Procedure\n\n### Observations",
        tables=entry_in.tables or [],
        attachments=entry_in.attachments or [],
        references=entry_in.references or [],
        last_activity=datetime.utcnow()
    )
    db.add(new_entry)
    db.flush()

    # Initial version v1.0
    v1 = EntryVersion(
        entry_id=new_entry.id,
        version="v1.0",
        user_name=current_user.full_name,
        timestamp=now_str,
        comment="Initial draft setup"
    )
    db.add(v1)
    db.commit()
    db.refresh(new_entry)
    return format_entry_response(new_entry)

def update_entry_content(db: Session, entry_id: str, updates: EntryUpdate, current_user: User):
    entry = db.query(NotebookEntry).filter(NotebookEntry.id == entry_id).first()
    if not entry:
        return None, "Entry not found"

    if entry.status == "Approved":
        return None, "Cannot update approved entry"

    updated = False
    if updates.title is not None and updates.title != entry.title:
        entry.title = updates.title
        updated = True

    if updates.content is not None and updates.content != entry.content:
        entry.content = updates.content
        updated = True

    if updated:
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
        last_v = entry.versions[-1].version if entry.versions else "v1.0"
        try:
            ver_num = float(last_v.replace("v", "")) + 0.1
        except Exception:
            ver_num = 1.1
        next_ver = f"v{ver_num:.1f}"

        ver = EntryVersion(
            entry_id=entry.id,
            version=next_ver,
            user_name=current_user.full_name,
            timestamp=now_str,
            comment="Content updated"
        )
        entry.last_activity = datetime.utcnow()
        db.add(ver)
        db.commit()
        db.refresh(entry)

    return format_entry_response(entry), None

def sign_entry(db: Session, entry_id: str, current_user: User):
    entry = db.query(NotebookEntry).filter(NotebookEntry.id == entry_id).first()
    if not entry:
        return None, "Entry not found"

    if entry.status != "Approved":
        entry.status = "Approved"
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
        last_v = entry.versions[-1].version if entry.versions else "v1.0"
        try:
            ver_num = float(last_v.replace("v", "")) + 0.1
        except Exception:
            ver_num = 1.2
        next_ver = f"v{ver_num:.1f}"

        ver = EntryVersion(
            entry_id=entry.id,
            version=next_ver,
            user_name=current_user.full_name,
            timestamp=now_str,
            comment="Signed and locked compliance seal"
        )
        entry.last_activity = datetime.utcnow()
        db.add(ver)
        db.commit()
        db.refresh(entry)

    return format_entry_response(entry), None

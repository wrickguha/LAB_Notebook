"""
Lab Notebook Router
  GET   /api/notebook/folders              — list folders
  POST  /api/notebook/folders              — create folder
  GET   /api/notebook/entries              — list entries (filterable by folderId)
  GET   /api/notebook/entries/{id}         — single entry
  POST  /api/notebook/entries              — create entry
  PATCH /api/notebook/entries/{id}/content — update content (+ version bump)
  POST  /api/notebook/entries/{id}/sign    — digitally sign & approve
"""

import time
from datetime import datetime, timezone, date
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from app.database import db
from app.schemas import (
    NotebookFolderOut,
    NotebookFolderCreate,
    NotebookEntryOut,
    NotebookEntryCreate,
    NotebookEntryContentUpdate,
)

router = APIRouter(prefix="/api/notebook", tags=["notebook"])


def _audit(action: str, target: str) -> None:
    db["audit_logs"].insert(0, {
        "id": f"log-{int(time.time() * 1000)}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "user": db["user"]["name"],
        "action": action,
        "target": target,
        "ip": "192.168.1.144",
        "status": "Compliant",
    })


def _notify(title: str, message: str, notif_type: str = "info") -> None:
    db["_notification_counter"] += 1
    db["notifications"].insert(0, {
        "id": db["_notification_counter"],
        "title": title,
        "message": message,
        "time": "Just now",
        "read": False,
        "type": notif_type,
    })


# ── Folders ────────────────────────────────────────────────────────────────

@router.get("/folders", response_model=List[NotebookFolderOut])
def list_folders():
    return db["notebook_folders"]


@router.post("/folders", response_model=NotebookFolderOut, status_code=201)
def create_folder(body: NotebookFolderCreate):
    """Mirrors addNotebookFolder() in AppContext.jsx."""
    new_folder = {
        "id": f"folder-{int(time.time() * 1000)}",
        "name": body.name,
    }
    db["notebook_folders"].append(new_folder)
    _audit("Create Folder", f"Folder: {body.name}")
    return new_folder


# ── Entries ────────────────────────────────────────────────────────────────

@router.get("/entries", response_model=List[NotebookEntryOut])
def list_entries(folder_id: Optional[str] = Query(None, alias="folderId")):
    """
    Return all entries, optionally filtered by folderId.
    Mirrors notebookEntries (and currentFolderEntries filter) in context.
    """
    entries = db["notebook_entries"]
    if folder_id:
        entries = [e for e in entries if e["folderId"] == folder_id]
    return entries


@router.get("/entries/{entry_id}", response_model=NotebookEntryOut)
def get_entry(entry_id: str):
    entry = next((e for e in db["notebook_entries"] if e["id"] == entry_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail="Notebook entry not found")
    return entry


@router.post("/entries", response_model=NotebookEntryOut, status_code=201)
def create_entry(body: NotebookEntryCreate):
    """
    Mirrors addNotebookEntry() in AppContext.jsx.
    Auto-populates author, date, versionHistory, etc.
    """
    user = db["user"]
    new_id = f"note-{int(time.time() * 1000)}"
    entry = {
        "id": new_id,
        "folderId": body.folderId,
        "projectId": body.projectId,
        "title": body.title,
        "status": body.status or "Draft",
        "date": date.today().isoformat(),
        "author": user["name"],
        "content": body.content or "",
        "attachments": [],
        "tables": [],
        "versionHistory": [
            {
                "version": "v1.0",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "user": user["name"],
                "comment": "Document created",
            }
        ],
        "references": [],
    }
    db["notebook_entries"].insert(0, entry)
    _audit("Create Notebook Entry", f"Notebook Entry: {body.title}")
    _notify(
        "Notebook Entry Added",
        f'New experiment log "{body.title}" has been drafted.',
    )
    return entry


@router.patch("/entries/{entry_id}/content", response_model=NotebookEntryOut)
def update_entry_content(entry_id: str, body: NotebookEntryContentUpdate):
    """
    Update the markdown content (and optionally title) of a notebook entry,
    appending a new version to the version history.
    Mirrors updateNotebookEntryContent() in AppContext.jsx.
    """
    entry = next((e for e in db["notebook_entries"] if e["id"] == entry_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail="Notebook entry not found")

    if entry["status"] == "Approved":
        raise HTTPException(status_code=403, detail="Cannot edit a signed/approved entry.")

    entry["content"] = body.content
    if body.title is not None:
        entry["title"] = body.title

    version_num = f"v1.{len(entry['versionHistory'])}"
    entry["versionHistory"].insert(0, {
        "version": version_num,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "user": db["user"]["name"],
        "comment": "Content updated in editor",
    })

    _audit("Edit Document Content", f"Notebook ID: {entry_id}")
    return entry


@router.post("/entries/{entry_id}/sign", response_model=NotebookEntryOut)
def sign_entry(entry_id: str):
    """
    Digitally sign and lock a notebook entry (status → 'Approved').
    Mirrors approveNotebookEntry() in AppContext.jsx.
    """
    entry = next((e for e in db["notebook_entries"] if e["id"] == entry_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail="Notebook entry not found")

    entry["status"] = "Approved"
    _audit("Digital Signature Applied", f"Signed and Approved Notebook ID: {entry_id}")
    _notify(
        "Experiment Approved",
        f"Your digital signature is finalized on document ID {entry_id}.",
        "approval",
    )
    return entry

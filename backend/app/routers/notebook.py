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

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import (
    NotebookFolderOut,
    NotebookFolderCreate,
    NotebookEntryOut,
    NotebookEntryCreate,
    NotebookEntryContentUpdate,
)
import app.crud as crud

router = APIRouter(prefix="/api/notebook", tags=["notebook"])


# ── Folders ────────────────────────────────────────────────────────────────

@router.get("/folders", response_model=List[NotebookFolderOut])
def list_folders(db: Session = Depends(get_db)):
    """List all notebook folders."""
    return crud.get_notebook_folders(db)


@router.post("/folders", response_model=NotebookFolderOut, status_code=201)
def create_folder(body: NotebookFolderCreate, db: Session = Depends(get_db)):
    """
    Create a new notebook folder.
    Mirrors addNotebookFolder() in AppContext.jsx.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"
    return crud.create_notebook_folder(db, body.name, user_name)


# ── Entries ────────────────────────────────────────────────────────────────

@router.get("/entries", response_model=List[NotebookEntryOut])
def list_entries(
    folder_id: Optional[str] = Query(None, alias="folderId"),
    db: Session = Depends(get_db)
):
    """
    Return all entries, optionally filtered by folderId.
    Mirrors notebookEntries (and currentFolderEntries filter) in context.
    """
    return crud.get_notebook_entries(db, folder_id)


@router.get("/entries/{entry_id}", response_model=NotebookEntryOut)
def get_entry(entry_id: str, db: Session = Depends(get_db)):
    """Retrieve details of a single notebook entry."""
    entry = crud.get_notebook_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Notebook entry not found")
    return entry


@router.post("/entries", response_model=NotebookEntryOut, status_code=201)
def create_entry(body: NotebookEntryCreate, db: Session = Depends(get_db)):
    """
    Mirrors addNotebookEntry() in AppContext.jsx.
    Auto-populates author, date, versionHistory, etc.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"
    return crud.create_notebook_entry(
        db=db,
        folder_id=body.folderId,
        project_id=body.projectId,
        title=body.title,
        status=body.status,
        content=body.content,
        user_name=user_name
    )


@router.patch("/entries/{entry_id}/content", response_model=NotebookEntryOut)
def update_entry_content(
    entry_id: str,
    body: NotebookEntryContentUpdate,
    db: Session = Depends(get_db)
):
    """
    Update the markdown content (and optionally title) of a notebook entry,
    appending a new version to the version history.
    Mirrors updateNotebookEntryContent() in AppContext.jsx.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"

    entry = crud.update_notebook_entry_content(
        db=db,
        entry_id=entry_id,
        content=body.content,
        title=body.title,
        user_name=user_name
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Notebook entry not found")
    return entry


@router.post("/entries/{entry_id}/sign", response_model=NotebookEntryOut)
def sign_entry(entry_id: str, db: Session = Depends(get_db)):
    """
    Digitally sign and lock a notebook entry (status → 'Approved').
    Mirrors approveNotebookEntry() in AppContext.jsx.
    """
    user = crud.get_user(db)
    user_name = user.name if user else "Dr. Evelyn Thorne"

    entry = crud.approve_notebook_entry(db, entry_id, user_name)
    if not entry:
        raise HTTPException(status_code=404, detail="Notebook entry not found")
    return entry

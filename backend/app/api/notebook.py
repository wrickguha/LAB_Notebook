from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Any, Optional
from app.db.database import get_db
from app.models.user import User
from app.schemas.notebook import FolderCreate, EntryCreate, EntryUpdate
from app.api.deps import get_current_user
import app.services.notebook_service as ns
from app.services.audit_service import add_audit_log
from app.schemas.audit_log import AuditLogCreate

router = APIRouter(prefix="/notebook", tags=["notebook"])

@router.get("/folders", response_model=List[Any])
async def get_folders(db: Session = Depends(get_db)):
    return ns.list_folders(db)

@router.post("/folders", response_model=Any)
async def create_folder(
    folder_in: FolderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    folder = ns.create_folder(db, folder_in.name, current_user)
    add_audit_log(
        db,
        AuditLogCreate(
            action="New Folder Created",
            target=f"Cabinet Folder: {folder['name']}"
        ),
        current_user
    )
    return folder

@router.get("/entries", response_model=List[Any])
async def get_entries(
    folder_id: Optional[str] = Query(None, alias="folderId"),
    db: Session = Depends(get_db)
):
    return ns.list_entries(db, folder_id)

@router.get("/entries/{id}", response_model=Any)
async def get_entry(
    id: str,
    db: Session = Depends(get_db)
):
    entry = ns.get_entry(db, id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notebook entry not found"
        )
    return entry

@router.post("/entries", response_model=Any)
async def create_entry(
    entry_in: EntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = ns.create_entry(db, entry_in, current_user)
    add_audit_log(
        db,
        AuditLogCreate(
            action="Notebook Draft Created",
            target=f"Entry: {entry['title']}"
        ),
        current_user
    )
    return entry

@router.put("/entries/{id}", response_model=Any)
async def update_entry(
    id: str,
    updates: EntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry, err = ns.update_entry_content(db, id, updates, current_user)
    if err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err
        )
    return entry

@router.post("/entries/{id}/sign", response_model=Any)
async def sign_entry(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry, err = ns.sign_entry(db, id, current_user)
    if err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err
        )
    add_audit_log(
        db,
        AuditLogCreate(
            action="FDA 21 CFR Part 11 Compliance Seal Applied",
            target=f"Entry: {entry['title']}"
        ),
        current_user
    )
    return entry

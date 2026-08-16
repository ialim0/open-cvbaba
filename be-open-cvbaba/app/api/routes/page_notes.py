from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Optional

from app.db import get_db
from app.db import get_db
from app.core.workspace import get_workspace_user
from app.models.user import User
from app.models.chat import Chat
from app.models.page_note import PageNote
from app.schemas.page_note import PageNoteCreate, PageNoteUpdate, PageNoteResponse

router = APIRouter()

@router.post("/chat/{chat_slug}/pages/{page_number}/note", response_model=PageNoteResponse)
async def create_page_note(
    chat_slug: str,
    page_number: int,
    note_in: PageNoteCreate,
    current_user: User = Depends(get_workspace_user),
    db: Session = Depends(get_db)
):
    # Retrieve chat and verify ownership
    chat = db.query(Chat).filter(Chat.slug == chat_slug, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # Check if note already exists for this page
    existing_note = db.query(PageNote).filter(
        PageNote.chat_id == chat.id,
        PageNote.page_number == page_number
    ).first()

    if existing_note:
        raise HTTPException(status_code=400, detail="Note already exists for this page")

    new_note = PageNote(
        chat_id=chat.id,
        page_number=page_number,
        title=note_in.title,
        content=note_in.content,
        style_metadata=note_in.style_metadata
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@router.patch("/chat/{chat_slug}/pages/{page_number}/note", response_model=PageNoteResponse)
async def update_page_note(
    chat_slug: str,
    page_number: int,
    note_in: PageNoteUpdate,
    current_user: User = Depends(get_workspace_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(Chat.slug == chat_slug, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    note = db.query(PageNote).filter(
        PageNote.chat_id == chat.id,
        PageNote.page_number == page_number
    ).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if note_in.title is not None:
        note.title = note_in.title
    if note_in.content is not None:
        note.content = note_in.content
    if note_in.style_metadata is not None:
        note.style_metadata = note_in.style_metadata

    db.commit()
    db.refresh(note)
    return note

@router.delete("/chat/{chat_slug}/pages/{page_number}/note", status_code=status.HTTP_204_NO_CONTENT)
async def delete_page_note(
    chat_slug: str,
    page_number: int,
    current_user: User = Depends(get_workspace_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(Chat.slug == chat_slug, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    note = db.query(PageNote).filter(
        PageNote.chat_id == chat.id,
        PageNote.page_number == page_number
    ).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    db.delete(note)
    db.commit()

@router.get("/chat/{chat_slug}/pages/{page_number}/note", response_model=PageNoteResponse)
async def get_page_note(
    chat_slug: str,
    page_number: int,
    current_user: User = Depends(get_workspace_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(Chat.slug == chat_slug, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    note = db.query(PageNote).filter(
        PageNote.chat_id == chat.id,
        PageNote.page_number == page_number
    ).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return note

@router.get("/chat/{chat_slug}/notes", response_model=List[PageNoteResponse])
async def get_chat_notes(
    chat_slug: str,
    current_user: User = Depends(get_workspace_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(Chat.slug == chat_slug, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    return chat.notes

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from app.db import get_db
from app.models import User
from app.schemas.chat import CommentCreate, CommentResponse
from app.services.chat.chat_service import ChatService
from app.core.workspace import get_workspace_user

logger = logging.getLogger(__name__)

chat_comment_router = APIRouter()

def get_chat_service() -> ChatService:
    return ChatService()

@chat_comment_router.post("/{slug}/comments", response_model=CommentResponse)
async def add_comment(
    slug: str,
    comment_input: CommentCreate,
    current_user: User = Depends(get_workspace_user),
    db: Session = Depends(get_db),
    chat_service: ChatService = Depends(get_chat_service)
):
    """Add a comment to a shared document."""
    try:
        comment = await chat_service.add_comment(
            db=db,
            slug=slug,
            user=current_user,
            content=comment_input.content,
            page_number=comment_input.page_number
        )
        # Convert to response schema
        response = CommentResponse.model_validate(comment)
        response.is_own_comment = True
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error adding comment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not add comment"
        )

@chat_comment_router.get("/{slug}/comments", response_model=List[CommentResponse])
async def list_comments(
    slug: str,
    current_user: User = Depends(get_workspace_user),
    db: Session = Depends(get_db),
    chat_service: ChatService = Depends(get_chat_service)
):
    """List comments for a shared document."""
    try:
        comments = await chat_service.get_comments(
            db=db,
            slug=slug,
            user=current_user
        )
        
        # Convert to list of response schemas and mark own comments
        result = []
        for c in comments:
            resp = CommentResponse.model_validate(c)
            resp.is_own_comment = (c.user_id == current_user.id)
            result.append(resp)
            
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error listing comments: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve comments"
        )

@chat_comment_router.patch("/comments/{comment_id}", response_model=CommentResponse)
async def update_comment(
    comment_id: int,
    comment_input: CommentCreate,
    current_user: User = Depends(get_workspace_user),
    db: Session = Depends(get_db),
    chat_service: ChatService = Depends(get_chat_service)
):
    """Edit a comment."""
    try:
        comment = await chat_service.update_comment(
            db=db,
            comment_id=comment_id,
            user_id=current_user.id,
            content=comment_input.content
        )
        response = CommentResponse.model_validate(comment)
        response.is_own_comment = True
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error updating comment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not update comment"
        )

@chat_comment_router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_workspace_user),
    db: Session = Depends(get_db),
    chat_service: ChatService = Depends(get_chat_service)
):
    """Delete a comment."""
    try:
        await chat_service.delete_comment(
            db=db,
            comment_id=comment_id,
            user_id=current_user.id
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error deleting comment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not delete comment"
        )

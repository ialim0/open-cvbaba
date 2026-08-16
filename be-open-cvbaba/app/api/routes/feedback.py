# api/routes/feedback.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import Optional
from datetime import datetime, timezone, timedelta
import logging

from app.db import get_db
from app.models import User
from app.models.feedback import Feedback
from app.core.workspace import get_workspace_user
from app.schemas.feedback import (
    QuickFeedbackRequest,
    QuickFeedbackResponse,
    WhyFeedbackRequest,
    WhyFeedbackResponse,
    DailyStatsResponse,
    IssueCount,
)
from app.config import settings

logger = logging.getLogger(__name__)


from app.services.feedback_notification import send_daily_feedback_summary


class FeedbackRouter:
    """YC-style feedback: ship fast, measure one metric, talk to users."""

    def __init__(self):
        self.router = APIRouter()
        self._register_routes()

    def _register_routes(self):
        self.router.post("/quick", response_model=QuickFeedbackResponse)(self.quick_feedback)
        self.router.post("/{feedback_id}/why", response_model=WhyFeedbackResponse)(self.why_feedback)
        self.router.get("/stats/daily", response_model=DailyStatsResponse)(self.daily_stats)

    async def quick_feedback(
        self,
        request: QuickFeedbackRequest,
        db: Session = Depends(get_db),
        current_user: Optional[User] = Depends(get_workspace_user),
    ) -> QuickFeedbackResponse:
        """
        Quick 👍/👎 feedback capture.
        
        Accepts anonymous feedback (no auth required).
        If user is authenticated, links feedback to their account.
        """
        try:
            feedback = Feedback(
                user_id=current_user.id if current_user else None,
                chat_slug=request.chat_slug,
                is_helpful=request.is_helpful,
            )
            db.add(feedback)
            db.commit()
            db.refresh(feedback)

            logger.info(
                f"Quick feedback received: id={feedback.id}, "
                f"helpful={request.is_helpful}, user={'auth' if current_user else 'anon'}"
            )

            return QuickFeedbackResponse(id=feedback.id, status="received")

        except Exception as e:
            db.rollback()
            logger.error(f"Error saving quick feedback: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save feedback"
            )

    async def why_feedback(
        self,
        feedback_id: int,
        request: WhyFeedbackRequest,
        db: Session = Depends(get_db),
    ) -> WhyFeedbackResponse:
        """
        Follow-up: why unhelpful + optional comment.
        
        Called after user clicks 👎 and optionally adds context.
        No auth required to match original feedback.
        """
        feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
        
        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found"
            )

        try:
            # Validate why_unhelpful if provided
            valid_reasons = {"confusing", "incorrect", "too_slow"}
            if request.why_unhelpful and request.why_unhelpful not in valid_reasons:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"why_unhelpful must be one of: {', '.join(valid_reasons)}"
                )

            feedback.why_unhelpful = request.why_unhelpful
            feedback.comment = request.comment
            feedback.contact_ok = request.contact_ok
            db.commit()

            logger.info(
                f"Why feedback updated: id={feedback_id}, "
                f"reason={request.why_unhelpful}, contact_ok={request.contact_ok}"
            )

            return WhyFeedbackResponse(id=feedback_id, status="updated")

        except HTTPException:
            raise
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating feedback {feedback_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update feedback"
            )

    async def daily_stats(
        self,
        send_to_slack: bool = False,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_workspace_user),
    ) -> DailyStatsResponse:
        """
        Daily feedback metrics for admin dashboard.
        
        Returns thumbs up %, samples today, pending contacts, top issues.
        Requires authentication (admin check via ADMIN_EMAILS).
        """
        # Check if user is admin
        if current_user.email not in settings.ADMIN_EMAILS:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        try:
            # Get today's start (UTC)
            today_start = datetime.now(timezone.utc).replace(
                hour=0, minute=0, second=0, microsecond=0
            )

            # Query today's feedback
            today_filter = Feedback.created_at >= today_start

            # Total samples today
            samples_today = db.query(func.count(Feedback.id)).filter(today_filter).scalar() or 0

            # Thumbs up count
            thumbs_up = db.query(func.count(Feedback.id)).filter(
                today_filter,
                Feedback.is_helpful == True
            ).scalar() or 0

            # Calculate percentage
            thumbs_up_percentage = (thumbs_up / samples_today * 100) if samples_today > 0 else 0.0

            # Pending contacts (all time, not just today)
            pending_contacts = db.query(func.count(Feedback.id)).filter(
                Feedback.contact_ok == True,
                Feedback.is_helpful == False  # Only unhelpful ones requesting contact
            ).scalar() or 0

            # Top issues (from unhelpful feedback with reasons)
            issue_counts = db.query(
                Feedback.why_unhelpful,
                func.count(Feedback.id).label('count')
            ).filter(
                Feedback.why_unhelpful.isnot(None)
            ).group_by(
                Feedback.why_unhelpful
            ).order_by(
                func.count(Feedback.id).desc()
            ).limit(5).all()

            top_issues = [
                IssueCount(issue=row[0], count=row[1])
                for row in issue_counts
            ]

            logger.info(
                f"Daily stats requested by {current_user.email}: "
                f"{thumbs_up_percentage:.1f}% positive, {samples_today} samples"
            )
            
            stats = DailyStatsResponse(
                thumbs_up_percentage=round(thumbs_up_percentage, 1),
                samples_today=samples_today,
                pending_contacts=pending_contacts,
                top_issues=top_issues,
            )

            if send_to_slack:
                await send_daily_feedback_summary(stats)

            return stats

        except Exception as e:
            logger.error(f"Error fetching daily stats: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch statistics"
            )


feedback_router = FeedbackRouter().router

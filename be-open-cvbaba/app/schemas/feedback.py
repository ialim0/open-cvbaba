# schemas/feedback.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class QuickFeedbackRequest(BaseModel):
    """Quick 👍/👎 feedback capture."""
    is_helpful: bool
    context_page: Optional[str] = None
    chat_slug: Optional[str] = None


class QuickFeedbackResponse(BaseModel):
    """Response after quick feedback submission."""
    id: int
    status: str = "received"


class WhyFeedbackRequest(BaseModel):
    """Follow-up: why unhelpful + optional comment."""
    why_unhelpful: Optional[str] = None  # "confusing" | "incorrect" | "too_slow"
    comment: Optional[str] = None
    contact_ok: bool = False


class WhyFeedbackResponse(BaseModel):
    """Response after why feedback update."""
    id: int
    status: str = "updated"


class IssueCount(BaseModel):
    """Single issue with count."""
    issue: str
    count: int


class DailyStatsResponse(BaseModel):
    """Daily feedback metrics for admin dashboard."""
    thumbs_up_percentage: float
    samples_today: int
    pending_contacts: int
    top_issues: List[IssueCount]

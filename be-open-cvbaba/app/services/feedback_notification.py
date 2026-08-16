# services/feedback_notification.py
import logging
from datetime import datetime
from app.config import settings
from app.schemas.feedback import DailyStatsResponse
from app.services.email import EmailService

logger = logging.getLogger(__name__)

async def send_daily_feedback_summary(stats: DailyStatsResponse):
    """
    Send daily feedback stats via email to all admin users.
    """
    if not settings.ADMIN_EMAILS:
        logger.warning("No ADMIN_EMAILS configured, skipping notification")
        return

    # Format the top issues
    top_issues_html = ""
    if stats.top_issues:
        top_issues_html = "<ul style='margin: 0; padding-left: 20px;'>"
        for issue in stats.top_issues:
            top_issues_html += f"<li><strong>{issue.issue}:</strong> {issue.count} occurrence(s)</li>"
        top_issues_html += "</ul>"
    else:
        top_issues_html = "<p style='color: #6b7280; font-style: italic;'>No issues reported today</p>"

    # Create email content
    content = f"""
        <h1>📊 Daily Feedback Summary</h1>
        
        <p class="greeting">Hi Admin,</p>
        
        <p>Here's your daily feedback report for {datetime.now().strftime('%B %d, %Y')}:</p>
        
        <div class="info-box">
            <p><span class="info-label">Positive Feedback:</span> {stats.thumbs_up_percentage}%</p>
            <p><span class="info-label">Total Samples Today:</span> {stats.samples_today}</p>
            <p><span class="info-label">Pending Contact Requests:</span> {stats.pending_contacts}</p>
        </div>
        
        <div class="divider"></div>
        
        <h2 style="font-size: 18px; margin-bottom: 16px;">Top Issues Today</h2>
        {top_issues_html}
        
        <div class="alert alert-info" style="margin-top: 24px;">
            <strong>💡 YC Principle:</strong> Do things that don't scale - personally reach out to users who requested contact!
        </div>
        
        <div class="button-wrapper">
            <a href="{settings.FRONTEND_BASE_URL}/admin/feedback" class="button">View All Feedback</a>
        </div>
    """

    # Send to all admin emails
    email_service = EmailService()
    
    for admin_email in settings.ADMIN_EMAILS:
        try:
            body = email_service._get_base_template(content)
            await email_service.send_email(
                admin_email, 
                f"Daily Feedback Summary - {datetime.now().strftime('%B %d, %Y')}", 
                body
            )
            logger.info(f"Sent daily feedback summary to {admin_email}")
        except Exception as e:
            logger.error(f"Failed to send feedback summary to {admin_email}: {e}")

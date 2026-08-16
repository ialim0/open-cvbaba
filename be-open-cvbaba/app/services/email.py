"""Optional email hooks for self-hosted document sharing."""
import logging
logger = logging.getLogger(__name__)
class EmailService:
    def _get_base_template(self, content: str, *args, **kwargs) -> str: return content
    async def send_email(self, *args, **kwargs): logger.info("Email delivery is disabled in the local edition")
    async def send_chat_share_notification(self, *args, **kwargs): await self.send_email()
    async def send_chat_share_confirmation(self, *args, **kwargs): await self.send_email()
    async def send_comment_notification(self, *args, **kwargs): await self.send_email()

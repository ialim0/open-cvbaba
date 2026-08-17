"""Best-effort HTML screenshot rendering for the visual critique node.

Playwright is optional: production can install it and run `playwright install`;
without it the pipeline remains functional and the critic reports no screenshot.
"""
import asyncio
import base64
import logging
from typing import Optional

logger = logging.getLogger(__name__)

async def render_html_screenshot(html: str, *, width: int = 794, height: int = 1123) -> Optional[str]:
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        logger.info("Playwright is not installed; visual critique screenshot skipped")
        return None
    try:
        async with async_playwright() as playwright:
            browser = await playwright.chromium.launch(headless=True)
            page = await browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
            await page.set_content(html, wait_until="networkidle")
            image = await page.screenshot(full_page=True, type="png")
            await browser.close()
            return base64.b64encode(image).decode("ascii")
    except Exception:
        logger.exception("Unable to render HTML screenshot")
        return None

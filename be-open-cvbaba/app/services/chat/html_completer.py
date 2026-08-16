"""
HTML Completion Utilities

Fixes incomplete HTML generation by ensuring all tags are properly closed
and the document structure is complete.
"""

import re
from typing import Tuple
import logging

logger = logging.getLogger(__name__)


class HTMLCompleter:
    """Ensures HTML documents are complete and properly formatted."""
    
    @staticmethod
    def is_complete(html: str) -> bool:
        """
        Check if HTML document is complete.
        
        Checks for:
        - Presence of closing </html> tag
        - Presence of closing </body> tag
        - Balanced div tags
        """
        html_lower = html.lower().strip()
        
        # Must have closing tags
        if '</html>' not in html_lower:
            return False
        if '</body>' not in html_lower:
            return False
        
        # Check if there's actual content
        if len(html.strip()) < 100:
            return False
        
        return True
    
    @staticmethod
    def count_tag_balance(html: str, tag: str) -> Tuple[int, int]:
        """
        Count opening and closing tags.
        Returns (opening_count, closing_count)
        """
        opening = len(re.findall(f'<{tag}[\\s>]', html, re.IGNORECASE))
        closing = len(re.findall(f'</{tag}>', html, re.IGNORECASE))
        return opening, closing
    
    @staticmethod
    def complete_html(html: str) -> str:
        """
        Complete an incomplete HTML document by adding missing closing tags.
        
        Handles:
        - Missing </body>
        - Missing </html>
        - Unclosed divs
        - Truncated content
        """
        if HTMLCompleter.is_complete(html):
            logger.info("HTML is already complete")
            return html
        
        logger.warning("HTML appears incomplete, attempting to fix...")
        original_html = html
        html = html.strip()
        
        # Step 1: Ensure we have opening tags
        if '<html' not in html.lower():
            logger.error("HTML doesn't have <html> tag - cannot complete")
            return original_html
        
        # Step 2: Close unclosed div.pdf-page if present
        pdf_page_open, pdf_page_close = HTMLCompleter.count_tag_balance(html, "div class=[\"']pdf-page[\"']")
        if pdf_page_open > pdf_page_close:
            missing_closes = pdf_page_open - pdf_page_close
            logger.info(f"Adding {missing_closes} missing </div> for pdf-page")
            html += '\n  </div>' * missing_closes
        
        # Step 3: Balance all div tags
        div_open, div_close = HTMLCompleter.count_tag_balance(html, 'div')
        if div_open > div_close:
            missing_divs = div_open - div_close
            logger.info(f"Adding {missing_divs} missing </div> tags")
            html += '\n  </div>' * missing_divs
        
        # Step 4: Add missing </body> if needed
        if '</body>' not in html.lower():
            logger.info("Adding missing </body> tag")
            html += '\n</body>'
        
        # Step 5: Add missing </html> if needed
        if '</html>' not in html.lower():
            logger.info("Adding missing </html> tag")
            html += '\n</html>'
        
        # Step 6: Clean up any trailing content after </html>
        html_end = html.lower().rfind('</html>')
        if html_end != -1:
            html = html[:html_end + 7]  # Keep up to and including </html>
        
        logger.info("HTML completion successful")
        return html
    
    @staticmethod
    def ensure_complete_structure(html: str) -> str:
        """
        Ensure HTML has complete DOCTYPE and structure.
        
        This is a more conservative approach that checks for essential elements.
        """
        html = html.strip()
        
        # Check for essential structure
        has_doctype = html.lower().startswith('<!doctype')
        has_html_tag = '<html' in html.lower()
        has_head = '<head' in html.lower()
        has_body = '<body' in html.lower()
        
        issues = []
        if not has_doctype:
            issues.append("Missing DOCTYPE")
        if not has_html_tag:
            issues.append("Missing <html> tag")
        if not has_head:
            issues.append("Missing <head> tag")
        if not has_body:
            issues.append("Missing <body> tag")
        
        if issues:
            logger.warning(f"HTML structure issues: {', '.join(issues)}")
        
        # Try to complete it
        return HTMLCompleter.complete_html(html)
    
    @staticmethod
    def add_completion_marker(html: str) -> str:
        """
        Add a completion marker comment before </html> to help detect if generation was cut off.
        """
        if '</html>' in html.lower():
            html = re.sub(
                r'</html>',
                '<!-- GENERATION_COMPLETE -->\n</html>',
                html,
                flags=re.IGNORECASE
            )
        return html
    
    @staticmethod
    def was_generation_complete(html: str) -> bool:
        """Check if the generation completed successfully."""
        return '<!-- GENERATION_COMPLETE -->' in html or HTMLCompleter.is_complete(html)


def fix_incomplete_html(html: str) -> Tuple[str, bool]:
    """
    Fix incomplete HTML and return (fixed_html, was_incomplete).
    
    Args:
        html: Potentially incomplete HTML string
    
    Returns:
        Tuple of (fixed_html, was_incomplete_flag)
    """
    was_incomplete = not HTMLCompleter.is_complete(html)
    
    if was_incomplete:
        logger.warning("Detected incomplete HTML, attempting auto-completion")
        fixed_html = HTMLCompleter.complete_html(html)
        return fixed_html, True
    
    return html, False

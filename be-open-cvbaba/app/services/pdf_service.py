"""
PDF Generation Service using WeasyPrint.

Converts HTML documents to high-quality PDF files optimized for A4 output.
"""

import logging
import re
from io import BytesIO
from typing import Optional, List, Set
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

# Lazy import to avoid startup issues if WeasyPrint dependencies aren't installed
_weasyprint = None

def _get_weasyprint():
    """Lazy load WeasyPrint to handle missing system dependencies gracefully."""
    global _weasyprint
    if _weasyprint is None:
        try:
            from weasyprint import HTML, CSS
            _weasyprint = (HTML, CSS)
        except ImportError as e:
            logger.error(f"WeasyPrint import failed: {e}")
            raise ImportError(
                "WeasyPrint is not installed or system dependencies are missing. "
                "Install with: pip install weasyprint"
            )
    return _weasyprint


# CSS to inject for proper A4 PDF rendering
PDF_BASE_CSS = """
@page {
    size: A4;
    margin: 0;
}

html, body {
    margin: 0;
    padding: 0;
}

/* Override any background colors for print */
.pdf-page {
    width: 794px !important;
    height: 1123px !important;
    margin: 0 !important;
    padding: 38px !important;
    box-sizing: border-box !important;
    page-break-after: always;
    page-break-inside: avoid;
}

/* Remove page break after the last page */
.pdf-page:last-child {
    page-break-after: auto;
}

/* Ensure images don't overflow */
img {
    max-width: 100%;
    height: auto;
}

/* Print-friendly link styling */
a {
    text-decoration: none;
    color: inherit;
}
"""


class PDFService:
    """Service for converting HTML documents to PDF."""
    
    @staticmethod
    def _ensure_complete_html(html_content: str) -> str:
        """Ensure HTML has proper structure for PDF rendering."""
        html_content = html_content.strip()
        
        # If it doesn't start with DOCTYPE, wrap it
        if not html_content.lower().startswith('<!doctype'):
            # Check if it has <html> tag
            if '<html' not in html_content.lower():
                # It's just content, wrap completely
                html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        {PDF_BASE_CSS}
    </style>
</head>
<body>
{html_content}
</body>
</html>"""
            else:
                # Has <html> but no DOCTYPE
                html_content = '<!DOCTYPE html>\n' + html_content
        
        return html_content
    
    @staticmethod
    def _inject_pdf_styles(html_content: str) -> str:
        """Inject PDF-specific styles into the HTML."""
        # Find the </head> tag and inject our CSS before it
        head_close = html_content.lower().find('</head>')
        
        if head_close != -1:
            css_injection = f"\n<style>\n{PDF_BASE_CSS}\n</style>\n"
            html_content = html_content[:head_close] + css_injection + html_content[head_close:]
        
        return html_content
    
    @staticmethod
    def _filter_html_pages(html_content: str, pages: Optional[List[int]]) -> str:
        """
        Filter HTML content to include only specified pages.
        
        Args:
            html_content: The full HTML string
            pages: List of 0-based page indices to keep. If None, keep all.
        """
        if pages is None:
            return html_content
            
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            pdf_pages = soup.find_all('div', class_='pdf-page')
            
            if not pdf_pages:
                logger.warning("No .pdf-page elements found for filtering")
                return html_content
                
            indexes_to_keep = set(pages)
            
            # Remove pages not in the list
            for i, page in enumerate(pdf_pages):
                if i not in indexes_to_keep:
                    page.decompose()
            
            return str(soup)
            
        except Exception as e:
            logger.warning(f"Page filtering failed: {e}")
            return html_content

    
    @classmethod
    def html_to_pdf(
        cls,
        html_content: str,
        base_url: Optional[str] = None,
        pages: Optional[List[int]] = None
    ) -> bytes:
        """
        Convert HTML content to PDF bytes.
        
        Args:
            html_content: The HTML string to convert
            base_url: Optional base URL for resolving relative URLs (fonts, images)
        
        Returns:
            PDF file as bytes
        
        Raises:
            ImportError: If WeasyPrint is not installed
            Exception: If PDF generation fails
        """
        HTML, CSS = _get_weasyprint()
        
        try:
            # Prepare HTML
            html_content = cls._ensure_complete_html(html_content)
            
            # Filter pages if requested
            if pages is not None:
                html_content = cls._filter_html_pages(html_content, pages)
                
            html_content = cls._inject_pdf_styles(html_content)
            
            # Create HTML document
            # Using a base_url helps WeasyPrint resolve @import for Google Fonts
            html_doc = HTML(
                string=html_content,
                base_url=base_url or "https://fonts.googleapis.com"
            )
            
            # Generate PDF
            pdf_bytes = html_doc.write_pdf()
            
            logger.info(f"PDF generated successfully ({len(pdf_bytes)} bytes)")
            return pdf_bytes
            
        except Exception as e:
            logger.error(f"PDF generation failed: {e}", exc_info=True)
            raise
    
    @classmethod
    def generate_filename(cls, title: str) -> str:
        """Generate a safe filename from the document title."""
        # Remove or replace unsafe characters
        safe_title = re.sub(r'[<>:"/\\|?*]', '', title)
        safe_title = safe_title.strip()
        
        # Limit length
        if len(safe_title) > 100:
            safe_title = safe_title[:100]
        
        # Default if empty
        if not safe_title:
            safe_title = "document"
        
        return f"{safe_title}.pdf"

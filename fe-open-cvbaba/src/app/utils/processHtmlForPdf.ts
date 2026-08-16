import { PDF_DIMENSIONS } from './pdfStyles';

/**
 * Wraps HTML content in page containers for accurate preview
 * This ensures the preview matches the final PDF output
 */
export const wrapContentInPages = (htmlContent: string): string => {
  // If content already has pdf-page containers, return as-is
  if (htmlContent.includes('class="pdf-page"')) {
    return htmlContent;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  
  // Get all direct children of body
  const bodyChildren = Array.from(doc.body.children);
  
  if (bodyChildren.length === 0) {
    // If body is empty, wrap the innerHTML
    const pageDiv = doc.createElement('div');
    pageDiv.className = 'pdf-page';
    pageDiv.innerHTML = doc.body.innerHTML;
    doc.body.innerHTML = '';
    doc.body.appendChild(pageDiv);
    return doc.body.innerHTML;
  }

  // Create first page
  let currentPage = doc.createElement('div');
  currentPage.className = 'pdf-page';
  const newBody = doc.createElement('div');

  for (const child of bodyChildren) {
    // Check if this element has a page-break class or data attribute
    const hasPageBreak = child.classList.contains('page-break') || 
                        child.classList.contains('page-break-before') ||
                        child.hasAttribute('data-page-break');
    
    if (hasPageBreak) {
      // Finalize current page and start a new one
      if (currentPage.children.length > 0 || currentPage.textContent?.trim()) {
        newBody.appendChild(currentPage);
      }
      currentPage = doc.createElement('div');
      currentPage.className = 'pdf-page';
      
      // Don't add the page-break element itself unless it has content
      if (child.textContent?.trim() || child.children.length > 0) {
        const clonedChild = child.cloneNode(true) as Element;
        clonedChild.classList.remove('page-break', 'page-break-before');
        clonedChild.removeAttribute('data-page-break');
        currentPage.appendChild(clonedChild);
      }
    } else {
      currentPage.appendChild(child.cloneNode(true));
    }
  }

  // Add the last page if it has content
  if (currentPage.children.length > 0 || currentPage.textContent?.trim()) {
    newBody.appendChild(currentPage);
  }

  return newBody.innerHTML;
};

/**
 * Processes HTML content for PDF generation
 * Ensures images load properly and content is optimized
 */
export const processHtmlForPdf = (htmlContent: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  doc.body.style.margin = "0";
  doc.body.style.padding = "0";

  // Ensure images load eagerly and decode synchronously to reduce rendering delays
  const images = Array.from(doc.querySelectorAll<HTMLImageElement>("img"));
  for (const img of images) {
    img.setAttribute("loading", "eager");
    img.setAttribute("decoding", "sync");
    // Avoid layout shifts by ensuring width/height attributes exist if natural sizes are known
    if (!img.getAttribute("width") && img.naturalWidth) {
      img.setAttribute("width", String(img.naturalWidth));
    }
    if (!img.getAttribute("height") && img.naturalHeight) {
      img.setAttribute("height", String(img.naturalHeight));
    }
  }

  return doc.documentElement.outerHTML;
};

/**
 * Processes HTML for preview display
 * Wraps content in page containers for accurate visualization
 * This creates the WYSIWYG experience
 */
export const processHtmlForPreview = (htmlContent: string): string => {
  // If already wrapped in pdf-page containers, return as-is
  if (htmlContent.includes('class="pdf-page"') || htmlContent.includes("class='pdf-page'")) {
    return htmlContent;
  }
  
  // Otherwise, wrap the entire content in a single page container
  // The AI should handle multi-page breaks explicitly
  return wrapContentInPages(htmlContent);
};
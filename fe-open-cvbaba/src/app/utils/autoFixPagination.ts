import { PDF_DIMENSIONS } from './pdfStyles';

/**
 * Automatically fixes page breaks by redistributing content across pages
 * without requiring AI calls or user interaction.
 * 
 * This function:
 * 1. Detects pages that overflow the max height
 * 2. Moves overflowing content to the next page
 * 3. Creates new pages as needed
 * 4. Preserves HTML structure and styling
 * 5. Prevents orphaned headings (Smart Pagination)
 * 6. Splits large elements (paragraphs, lists, tables) to fill pages efficiently
 */
export function autoFixPagination(shadowRoot: ShadowRoot): boolean {
    const MAX_PAGE_HEIGHT = PDF_DIMENSIONS.A4_HEIGHT_PX;
    const MAX_CONTENT_HEIGHT = PDF_DIMENSIONS.CONTENT_HEIGHT_PX;
    const TOLERANCE = 5; // 5px tolerance

    let madeChanges = false;
    let iterations = 0;
    const MAX_ITERATIONS = 20; // Increased iterations for finer control

    while (iterations < MAX_ITERATIONS) {
        iterations++;
        let hasOverflow = false;

        const pages = Array.from(shadowRoot.querySelectorAll('.pdf-page'));

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i] as HTMLElement;
            const pageHeight = page.scrollHeight;

            // Check if page overflows
            if (pageHeight > MAX_PAGE_HEIGHT + TOLERANCE) {
                hasOverflow = true;
                madeChanges = true;

                // Get all direct children of the page
                const children = Array.from(page.children);

                // Find the split point - where content should be moved to next page
                let accumulatedHeight = 0;
                let splitIndex = -1;
                let elementToSplit: HTMLElement | null = null;
                let splitResult: { firstPart: HTMLElement, secondPart: HTMLElement } | null = null;

                for (let j = 0; j < children.length; j++) {
                    const child = children[j] as HTMLElement;
                    const childHeight = child.offsetHeight;
                    const childMarginBottom = parseInt(window.getComputedStyle(child).marginBottom || '0', 10);
                    const childMarginTop = parseInt(window.getComputedStyle(child).marginTop || '0', 10);
                    const totalChildHeight = childHeight + Math.max(childMarginBottom, childMarginTop); // Collapsing margins approximation

                    if (accumulatedHeight + totalChildHeight > MAX_CONTENT_HEIGHT) {
                        // This child causes overflow.
                        // Check if we can split it to fill the remaining space.
                        const remainingSpace = MAX_CONTENT_HEIGHT - accumulatedHeight;

                        // Only attempt to split if there's enough space to be worth it (e.g., > 40px)
                        if (canSplitElement(child) && remainingSpace > 40) {
                            const split = splitLargeElement(child, remainingSpace);
                            if (split) {
                                elementToSplit = child;
                                splitResult = split;
                                splitIndex = j;
                                break;
                            }
                        }

                        // If we can't split it or it's too small space, move the whole thing.
                        splitIndex = j;
                        break;
                    }
                    accumulatedHeight += totalChildHeight;
                }

                // Smart Pagination: Avoid orphaned headings
                // If we are moving the whole element (not splitting), check if previous was a heading
                if (splitIndex > 0 && !elementToSplit) {
                    const prevElement = children[splitIndex - 1] as HTMLElement;
                    const isHeading = /^H[1-6]$/.test(prevElement.tagName);
                    const isSectionTitle = prevElement.classList.contains('section-title') ||
                        prevElement.classList.contains('header') ||
                        prevElement.classList.contains('title');

                    if (isHeading || isSectionTitle) {
                        console.log('🧠 Smart Pagination: Moving orphaned heading to next page');
                        splitIndex--;
                    }
                }

                // If we found a split point, move content to next page
                if (splitIndex >= 0 && splitIndex < children.length) {
                    // Get or create next page
                    let nextPage = pages[i + 1] as HTMLElement;

                    if (!nextPage) {
                        // Create a new page
                        nextPage = document.createElement('div');
                        nextPage.className = 'pdf-page';

                        // Insert after current page
                        if (page.nextSibling) {
                            page.parentNode?.insertBefore(nextPage, page.nextSibling);
                        } else {
                            page.parentNode?.appendChild(nextPage);
                        }
                    }

                    if (elementToSplit && splitResult) {
                        // We are splitting an element
                        // 1. Replace the original element with the first part (fits on current page)
                        page.replaceChild(splitResult.firstPart, elementToSplit);

                        // 2. Insert the second part at the beginning of the next page
                        if (nextPage.firstChild) {
                            nextPage.insertBefore(splitResult.secondPart, nextPage.firstChild);
                        } else {
                            nextPage.appendChild(splitResult.secondPart);
                        }

                        // 3. Move all subsequent siblings to the next page (after the second part)
                        const elementsToMove = children.slice(splitIndex + 1);

                        // We need to insert them *after* the second part we just added
                        // But wait, if nextPage already existed, we are prepending to it.
                        // So order: [splitResult.secondPart, ...elementsToMove, ...originalNextPageContent]

                        const fragment = document.createDocumentFragment();
                        elementsToMove.forEach(el => fragment.appendChild(el));

                        if (splitResult.secondPart.nextSibling) {
                            nextPage.insertBefore(fragment, splitResult.secondPart.nextSibling);
                        } else {
                            // If secondPart is the last child (or only child), just append
                            nextPage.appendChild(fragment);
                        }

                    } else {
                        // We are moving elements starting from splitIndex
                        const elementsToMove = children.slice(splitIndex);

                        // Prepend to next page (to maintain order)
                        const fragment = document.createDocumentFragment();
                        elementsToMove.forEach(el => fragment.appendChild(el));

                        if (nextPage.firstChild) {
                            nextPage.insertBefore(fragment, nextPage.firstChild);
                        } else {
                            nextPage.appendChild(fragment);
                        }
                    }

                    // Break to re-check all pages from start
                    break;
                }
            }
        }

        // If no overflow detected, we're done
        if (!hasOverflow) {
            break;
        }
    }

    // Clean up empty pages
    const allPages = Array.from(shadowRoot.querySelectorAll('.pdf-page'));
    allPages.forEach(page => {
        if (!page.textContent?.trim() && page.children.length === 0) {
            page.remove();
        }
    });

    return madeChanges;
}

/**
 * Check if an element can be split (e.g., div, section, article)
 */
function canSplitElement(element: HTMLElement): boolean {
    const splittableTags = ['DIV', 'SECTION', 'ARTICLE', 'UL', 'OL', 'P', 'TABLE', 'BLOCKQUOTE', 'DL'];
    return splittableTags.includes(element.tagName) && !element.classList.contains('no-split');
}

/**
 * Split a large element into two parts at approximately the max height
 */
function splitLargeElement(
    element: HTMLElement,
    maxHeight: number
): { firstPart: HTMLElement; secondPart: HTMLElement } | null {
    const tagName = element.tagName;

    // For lists, split by items
    if (tagName === 'UL' || tagName === 'OL') {
        return splitList(element as HTMLUListElement | HTMLOListElement, maxHeight);
    }

    // For tables, split by rows
    if (tagName === 'TABLE') {
        return splitTable(element as HTMLTableElement, maxHeight);
    }

    // For paragraphs, try to split by sentences or words
    if (tagName === 'P') {
        return splitParagraph(element as HTMLParagraphElement, maxHeight);
    }

    // For containers (div, section, article), split by children
    if (['DIV', 'SECTION', 'ARTICLE', 'BLOCKQUOTE', 'DL'].includes(tagName)) {
        return splitContainer(element, maxHeight);
    }

    return null;
}

/**
 * Split a list element
 */
function splitList(
    list: HTMLUListElement | HTMLOListElement,
    maxHeight: number
): { firstPart: HTMLElement; secondPart: HTMLElement } | null {
    const items = Array.from(list.children);

    if (items.length <= 1) return null;

    let accumulatedHeight = 0;
    let splitIndex = -1;

    for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLElement;
        accumulatedHeight += item.offsetHeight;

        if (accumulatedHeight > maxHeight) {
            splitIndex = i;
            break;
        }
    }

    if (splitIndex <= 0 || splitIndex >= items.length) return null;

    // Create two new lists
    const firstPart = list.cloneNode(false) as HTMLElement;
    const secondPart = list.cloneNode(false) as HTMLElement;

    // Distribute items
    items.slice(0, splitIndex).forEach(item => {
        firstPart.appendChild(item.cloneNode(true));
    });

    items.slice(splitIndex).forEach(item => {
        secondPart.appendChild(item.cloneNode(true));
    });

    return { firstPart, secondPart };
}

/**
 * Split a table element by rows
 */
function splitTable(
    table: HTMLTableElement,
    maxHeight: number
): { firstPart: HTMLElement; secondPart: HTMLElement } | null {
    const rows = Array.from(table.querySelectorAll('tr'));

    if (rows.length <= 1) return null;

    let accumulatedHeight = 0;
    let splitIndex = -1;

    // Account for header height if present
    const thead = table.querySelector('thead');
    let headerHeight = 0;
    if (thead) {
        headerHeight = thead.offsetHeight;
        accumulatedHeight += headerHeight;
    }

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as HTMLElement;
        // Skip rows inside thead as they are already accounted for
        if (thead && thead.contains(row)) continue;

        accumulatedHeight += row.offsetHeight;

        if (accumulatedHeight > maxHeight) {
            splitIndex = i;
            break;
        }
    }

    if (splitIndex <= 0 || splitIndex >= rows.length) return null;

    // Create two new tables
    const firstPart = table.cloneNode(false) as HTMLElement;
    const secondPart = table.cloneNode(false) as HTMLElement;

    // Clone header for both parts if it exists
    if (thead) {
        firstPart.appendChild(thead.cloneNode(true));
        secondPart.appendChild(thead.cloneNode(true));
    }

    // Create bodies
    const body1 = document.createElement('tbody');
    const body2 = document.createElement('tbody');

    // Distribute rows (skipping header rows)
    let addedToFirst = false;
    rows.forEach((row, index) => {
        if (thead && thead.contains(row)) return;

        if (index < splitIndex) {
            body1.appendChild(row.cloneNode(true));
            addedToFirst = true;
        } else {
            body2.appendChild(row.cloneNode(true));
        }
    });

    if (!addedToFirst) return null;

    firstPart.appendChild(body1);
    secondPart.appendChild(body2);

    return { firstPart, secondPart };
}

/**
 * Split a paragraph
 */
function splitParagraph(
    paragraph: HTMLParagraphElement,
    maxHeight: number
): { firstPart: HTMLElement; secondPart: HTMLElement } | null {
    const text = paragraph.textContent || '';

    // Create a temporary clone to measure height
    const clone = paragraph.cloneNode(true) as HTMLElement;
    clone.style.visibility = 'hidden';
    clone.style.position = 'absolute';
    clone.style.width = paragraph.offsetWidth + 'px'; // Match width
    // Append to parent to ensure styles (fonts, etc.) are inherited correctly
    const parent = paragraph.parentNode as HTMLElement;
    if (parent) {
        parent.appendChild(clone);
    } else {
        document.body.appendChild(clone);
    }

    // If the whole paragraph fits, don't split (shouldn't happen if called correctly)
    if (clone.offsetHeight <= maxHeight) {
        if (parent) parent.removeChild(clone);
        else document.body.removeChild(clone);
        return null;
    }

    // Split by sentences first
    const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text];

    if (sentences.length <= 1) {
        // Fallback to word splitting if only one sentence
        if (parent) parent.removeChild(clone);
        else document.body.removeChild(clone);
        return splitParagraphByWords(paragraph, maxHeight);
    }

    let splitIndex = -1;
    let currentText = '';

    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        const prevText = currentText;
        currentText += sentence;
        clone.textContent = currentText;

        if (clone.offsetHeight > maxHeight) {
            // This sentence pushed it over
            splitIndex = i;
            // If the first sentence is too big, we need to split by words
            if (i === 0) {
                if (parent) parent.removeChild(clone);
                else document.body.removeChild(clone);
                return splitParagraphByWords(paragraph, maxHeight);
            }
            break;
        }
    }

    if (parent) parent.removeChild(clone);
    else document.body.removeChild(clone);

    if (splitIndex <= 0) return null;

    const firstPart = paragraph.cloneNode(false) as HTMLElement;
    const secondPart = paragraph.cloneNode(false) as HTMLElement;

    firstPart.textContent = sentences.slice(0, splitIndex).join('');
    secondPart.textContent = sentences.slice(splitIndex).join('');

    return { firstPart, secondPart };
}

function splitParagraphByWords(
    paragraph: HTMLParagraphElement,
    maxHeight: number
): { firstPart: HTMLElement; secondPart: HTMLElement } | null {
    const text = paragraph.textContent || '';
    const words = text.split(/\s+/);

    if (words.length <= 1) return null;

    const clone = paragraph.cloneNode(true) as HTMLElement;
    clone.style.visibility = 'hidden';
    clone.style.position = 'absolute';
    clone.style.width = paragraph.offsetWidth + 'px';

    const parent = paragraph.parentNode as HTMLElement;
    if (parent) {
        parent.appendChild(clone);
    } else {
        document.body.appendChild(clone);
    }

    let splitIndex = -1;
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        currentText += (i > 0 ? ' ' : '') + word;
        clone.textContent = currentText;

        if (clone.offsetHeight > maxHeight) {
            splitIndex = i;
            break;
        }
    }

    if (parent) parent.removeChild(clone);
    else document.body.removeChild(clone);

    if (splitIndex <= 0) return null;

    const firstPart = paragraph.cloneNode(false) as HTMLElement;
    const secondPart = paragraph.cloneNode(false) as HTMLElement;

    firstPart.textContent = words.slice(0, splitIndex).join(' ');
    secondPart.textContent = words.slice(splitIndex).join(' ');

    return { firstPart, secondPart };
}

/**
 * Split a container element by its children
 */
function splitContainer(
    container: HTMLElement,
    maxHeight: number
): { firstPart: HTMLElement; secondPart: HTMLElement } | null {
    const children = Array.from(container.children);

    if (children.length === 0) return null;

    let accumulatedHeight = 0;
    let splitIndex = -1;
    let elementToSplit: HTMLElement | null = null;
    let splitResult: { firstPart: HTMLElement, secondPart: HTMLElement } | null = null;

    for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const childHeight = child.offsetHeight;
        const childMarginBottom = parseInt(window.getComputedStyle(child).marginBottom || '0', 10);
        const childMarginTop = parseInt(window.getComputedStyle(child).marginTop || '0', 10);
        const totalChildHeight = childHeight + Math.max(childMarginBottom, childMarginTop);

        if (accumulatedHeight + totalChildHeight > maxHeight) {
            // This child causes overflow.
            const remainingSpace = maxHeight - accumulatedHeight;

            // Try to split this child
            if (canSplitElement(child) && remainingSpace > 30) {
                const split = splitLargeElement(child, remainingSpace);
                if (split) {
                    elementToSplit = child;
                    splitResult = split;
                    splitIndex = i;
                    break;
                }
            }

            splitIndex = i;
            break;
        }
        accumulatedHeight += totalChildHeight;
    }

    if (splitIndex < 0) return null; // Everything fits?

    const firstPart = container.cloneNode(false) as HTMLElement;
    const secondPart = container.cloneNode(false) as HTMLElement;

    // Add items before split
    children.slice(0, splitIndex).forEach(child => {
        firstPart.appendChild(child.cloneNode(true));
    });

    // Add split item
    if (elementToSplit && splitResult) {
        firstPart.appendChild(splitResult.firstPart);
        secondPart.appendChild(splitResult.secondPart);

        // Add remaining items to second part
        children.slice(splitIndex + 1).forEach(child => {
            secondPart.appendChild(child.cloneNode(true));
        });
    } else {
        // Add remaining items (including the one that didn't fit) to second part
        children.slice(splitIndex).forEach(child => {
            secondPart.appendChild(child.cloneNode(true));
        });
    }

    // If first part is empty, it means even the first item didn't fit.
    // In that case, we return null to indicate we couldn't split effectively *within* the constraints
    // (The caller will then move the whole container).
    if (firstPart.children.length === 0) return null;

    return { firstPart, secondPart };
}

// Physical A4 dimensions - matches backend PDF generation exactly
const PAGE_WIDTH = '210mm';
const PAGE_HEIGHT = '297mm';
const PAGE_MARGIN = '15mm'; // Matches backend @page { margin: 15mm }

export const pdfStyles = `
  /* Reset and base styles */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    box-sizing: border-box;
  }

  html {
    margin: 0;
    padding: 0;
    background-color: #525659;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #1a1a1a;
    background-color: #525659;
    width: 100%;
  }

  /* Page container - using physical mm units for 1:1 PDF parity */
  .pdf-page {
    width: ${PAGE_WIDTH};
    min-height: ${PAGE_HEIGHT};
    margin: 0 auto 24px auto;
    padding: ${PAGE_MARGIN};
    background-color: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    position: relative;
    page-break-after: always;
    break-after: page;
    box-sizing: border-box;
    overflow: hidden;
  }

  .pdf-page:first-child {
    margin-top: 0;
  }

  /* Page break utilities */
  .pdf-page-break {
    page-break-after: always;
    break-after: page;
    height: 0;
    margin: 0;
    padding: 0;
    border: none;
    display: block;
  }

  .page-break {
    page-break-after: always;
    break-after: page;
    display: block;
    height: 0;
    margin: 0;
    padding: 0;
  }

  .page-break-before {
    page-break-before: always;
    break-before: page;
  }

  .avoid-page-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
    break-after: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
    font-weight: 600;
    line-height: 1.4;
    margin-top: 1.5em;
  }

  h1 { 
    font-size: 18pt; 
    margin-bottom: 0.8em;
    margin-top: 0;
  }
  
  h2 { 
    font-size: 14pt; 
    margin-bottom: 0.6em; 
  }
  
  h3 { 
    font-size: 12pt; 
    margin-bottom: 0.5em; 
  }

  h4 { 
    font-size: 11pt; 
    margin-bottom: 0.4em; 
  }

  h5, h6 { 
    font-size: 10pt; 
    margin-bottom: 0.3em; 
  }

  /* Paragraphs */
  p {
    margin-bottom: 0.8em;
    line-height: 1.5;
    orphans: 3;
    widows: 3;
  }

  /* Images and tables */
  img, table, figure {
    page-break-inside: avoid;
    break-inside: avoid;
    max-width: 100%;
    height: auto;
  }

  img {
    display: block;
    margin: 0.8em 0;
  }

  /* Tables */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  th, td {
    border: 1px solid #e0e0e0;
    padding: 0.5em;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
    font-weight: 600;
  }

  /* Lists */
  ul, ol {
    margin-bottom: 0.8em;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.4em;
    line-height: 1.5;
  }

  /* Links */
  a {
    color: #0066cc;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* Sections */
  section, article {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Blockquotes */
  blockquote {
    margin: 0.8em 0;
    padding: 0.5em 1em;
    border-left: 3px solid #e0e0e0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Code blocks */
  pre, code {
    font-family: 'Courier New', Courier, monospace;
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 10pt;
  }

  pre {
    padding: 0.5em;
    overflow-x: auto;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Strong and emphasis */
  strong, b {
    font-weight: 600;
  }

  em, i {
    font-style: italic;
  }

  /* HR */
  hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 1em 0;
  }
`;

// Export dimensions for components that need them (in mm)
export const PDF_DIMENSIONS = {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_MARGIN,
};

# PDF Document Generation Rules for AI

## Overview
This document defines the **strict rules** that the AI must follow when generating HTML documents for PDF preview and printing. The frontend uses a **Shadow DOM** sandbox that mimics a real PDF environment, ensuring WYSIWYG rendering without interference from the webapp's styles.

---

## Critical Constraints

### ⛔ DO NOT USE
- **Tailwind CSS classes** (e.g., `text-xl`, `flex`, `p-4`) - Tailwind is NOT loaded in Shadow DOM
- **Multiple column layouts** - Keep layouts simple and single-column
- **External CSS frameworks** (Bootstrap, Tailwind, etc.)
- **Markdown code fences** (e.g., ` ```html `) - Return PURE HTML only
- **JavaScript** - Documents must be static HTML + CSS only
- **Background colors or decorative formatting** - Keep it professional
- **Emoji flags** - Use Flag Icons CSS library instead (e.g., `<span class="fi fi-us"></span>`)

### ✅ MUST USE
- **Vanilla CSS** within `<style>` tag
- **Semantic HTML5 tags** that map to `pdfStyles.ts`
- **Google Fonts** (specifically Inter) for typography
- **Clean, professional, traditional layouts**
- **A4 page structure** with precise dimensions

---

## A4 Page Dimensions (96 DPI)

```javascript
// Constants for A4 page at 96 DPI (1px = 0.264583mm)
const A4_WIDTH_PX = 794;      // 210mm
const A4_HEIGHT_PX = 1123;    // 297mm

// Margins (1cm on all sides)
const MARGIN_TOP_PX = 38;     // 1cm = 37.8px at 96dpi
const MARGIN_RIGHT_PX = 38;
const MARGIN_BOTTOM_PX = 38;
const MARGIN_LEFT_PX = 38;

// Actual printable/content area
const CONTENT_WIDTH_PX = 718;   // 794 - 76 (left+right margins)
const CONTENT_HEIGHT_PX = 1047; // 1123 - 76 (top+bottom margins)
```

**Key takeaway**: The AI has **1047px vertical space** per page for content.

---

## Required HTML Structure

Every document MUST follow this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Title</title>
  <style>
    /* A4 Page Dimensions at 96 DPI */
    .pdf-page {
      width: 794px;           /* 210mm */
      height: 1123px;         /* 297mm */
      min-height: 1123px;
      margin: 20px auto;
      padding: 38px;          /* 1cm margins on all sides */
      box-sizing: border-box;
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      position: relative;
      page-break-after: always;
      break-after: page;
    }
    
    /* Base styles */
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f5f5f5;
    }
    
    /* Document-specific styles here */
    h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 20px;
      margin-top: 0;
    }
    
    h2 {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 16px;
      margin-top: 24px;
    }
    
    p {
      margin-bottom: 16px;
      line-height: 1.7;
    }
    
    /* Add more specific styles as needed */
  </style>
</head>
<body>
  <!-- PAGE 1 -->
  <div class="pdf-page">
    <h1>Main Document Title</h1>
    <p>Content for page 1...</p>
  </div>
  
  <!-- PAGE 2 (if needed) -->
  <div class="pdf-page">
    <h2>Continued Content</h2>
    <p>Content for page 2...</p>
  </div>
  
  <!-- Additional pages as needed (up to 10 pages) -->
</body>
</html>
```

---

## Semantic HTML Mapping

The Shadow DOM applies styles from `pdfStyles.ts` based on semantic HTML tags. Use these tags correctly:

| Component | HTML Tag to Use | CSS Applied (auto) |
|-----------|----------------|-------------------|
| **Page Container** | `<div class="pdf-page">` | A4 size, white background, shadow, padding |
| **Main Title** | `<h1>` | 28px, bold, bottom margin |
| **Section Title** | `<h2>` | 22px, bold, margin |
| **Subsection Title** | `<h3>` | 18px, bold |
| **Text** | `<p>` | 16px, line-height 1.7 |
| **Lists** | `<ul>`, `<ol>`, `<li>` | Proper indentation, bullets |
| **Tables** | `<table>`, `<th>`, `<td>` | Full width, borders, light gray headers |
| **Bold Text** | `<strong>` or `<b>` | Font-weight 600 |
| **Italic Text** | `<em>` or `<i>` | Font-style italic |
| **Links** | `<a href="">` | Blue color, underline on hover |
| **Code** | `<code>`, `<pre>` | Monospace font, gray background |
| **Blockquote** | `<blockquote>` | Indented, left border |
| **Horizontal Rule** | `<hr>` | 1px solid line |
| **Page Break** | `<div class="page-break"></div>` | Forces new page (use sparingly) |

---

## Pagination Logic

### Understanding Page Height
- Each `<div class="pdf-page">` has **1047px of usable vertical space** for content
- Content that exceeds this height will overflow and be cut off
- The AI must **intelligently split content** across multiple pages

### Single Page Documents
Use **ONE** `<div class="pdf-page">` for:
- Cover letters (typically 1 page)
- Short documents
- Brief summaries

### Multi-Page Documents
Use **MULTIPLE** `<div class="pdf-page">` elements for:
- Resumes/CVs (often 2-3 pages)
- Long-form documents
- Reports

### Page Break Guidelines
1. **Natural Breaks**: Close the current `</div>` and open a new `<div class="pdf-page">`
2. **Forced Breaks**: Use `<div class="page-break"></div>` only when absolutely necessary
3. **Avoid Breaks**: Never break inside tables, images, or important sections
4. **Estimate Height**: 
   - `<h1>` ≈ 50px
   - `<h2>` ≈ 45px
   - `<p>` ≈ 40-60px (depending on content)
   - `<ul>` with 5 items ≈ 150px
   - `<table>` rows ≈ 50px per row

### Example: 2-Page Resume

```html
<body>
  <!-- PAGE 1: Header + Experience -->
  <div class="pdf-page">
    <h1>John Doe</h1>
    <p>john.doe@example.com | +1 234-567-8900</p>
    
    <h2>Professional Experience</h2>
    <p><strong>Senior Software Engineer</strong> - Tech Corp (2020-Present)</p>
    <ul>
      <li>Achievement 1</li>
      <li>Achievement 2</li>
    </ul>
    
    <p><strong>Software Engineer</strong> - Another Company (2018-2020)</p>
    <ul>
      <li>Achievement 1</li>
      <li>Achievement 2</li>
    </ul>
  </div>
  
  <!-- PAGE 2: Education + Skills -->
  <div class="pdf-page">
    <h2>Education</h2>
    <p><strong>B.S. Computer Science</strong> - University Name (2014-2018)</p>
    
    <h2>Skills</h2>
    <ul>
      <li>JavaScript, Python, Java</li>
      <li>React, Node.js, Django</li>
      <li>AWS, Docker, Kubernetes</li>
    </ul>
    
    <h2>Certifications</h2>
    <ul>
      <li>AWS Certified Solutions Architect</li>
      <li>Google Cloud Professional</li>
    </ul>
  </div>
</body>
```

---

## Document Type-Specific Rules

### Cover Letters
- **Pages**: Typically **1 page** only
- **Structure**:
  ```
  1. Header (Name, Contact)
  2. Date
  3. Recipient Address
  4. Greeting
  5. 3-4 Paragraphs (Introduction, Body, Conclusion)
  6. Closing
  7. Signature
  ```
- **Spacing**: More white space, professional tone

### Resumes/CVs
- **Pages**: **1-3 pages** depending on experience
- **Structure**:
  ```
  Page 1:
  - Header (Name, Contact, Summary)
  - Professional Experience (most recent 2-3 roles)
  
  Page 2 (if needed):
  - Additional Experience
  - Education
  - Skills
  
  Page 3 (if needed):
  - Certifications
  - Projects
  - Awards
  ```
- **Spacing**: Compact but readable, maximize content

### General Documents
- **Pages**: Up to **10 pages**
- **Structure**: Based on user request
- **Pagination**: Split logically by sections

---

## Styling Best Practices

### Typography
```css
/* Use Inter from Google Fonts */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #1a1a1a;
}

h1 { 
  font-size: 28px; 
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 20px;
}

h2 { 
  font-size: 22px; 
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
}

h3 { 
  font-size: 18px; 
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 12px;
}
```

### Colors
- **Text**: `#1a1a1a` (near black)
- **Background**: `#ffffff` (white)
- **Borders**: `#e0e0e0` (light gray)
- **Accents**: Use sparingly, stick to professional blues/grays

### Spacing
```css
/* DO NOT add margins inside .pdf-page */
/* The 38px padding is already applied */

/* Good spacing for content */
p {
  margin-bottom: 16px;
}

ul, ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

li {
  margin-bottom: 8px;
}

table {
  margin: 20px 0;
}
```

### Tables
```css
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
}
```

---

## Advanced Features

### Page Break Classes
```html
<!-- Force page break after this element -->
<div class="page-break"></div>

<!-- Avoid page break inside this element -->
<section class="avoid-page-break">
  <h2>Section Title</h2>
  <p>Content that should stay together...</p>
</section>
```

### Flag Icons (for international documents)
```html
<!-- Use Flag Icons CSS library, NOT emoji -->
<span class="fi fi-us"></span> United States
<span class="fi fi-fr"></span> France
<span class="fi fi-de"></span> Germany
```

---

## Quality Checklist

Before finalizing any HTML document, verify:

### ✅ Structure
- [ ] Starts with `<!DOCTYPE html>`
- [ ] Has complete `<html>`, `<head>`, `<body>` tags
- [ ] All content wrapped in `<div class="pdf-page">` elements
- [ ] No Tailwind classes used
- [ ] No external CSS links (all styles in `<style>` tag)

### ✅ Pagination
- [ ] Content fits within 1047px per page
- [ ] Logical page breaks between sections
- [ ] No orphaned headings at bottom of pages
- [ ] Maximum 10 pages total

### ✅ Styling
- [ ] Uses semantic HTML (h1, h2, p, ul, table, etc.)
- [ ] Professional, clean design
- [ ] No background colors or decorative elements
- [ ] Uses Google Fonts (Inter preferred)

### ✅ Content
- [ ] No placeholder text (Lorem ipsum)
- [ ] Actual user-requested content
- [ ] Proper grammar and spelling
- [ ] Professional tone

### ✅ Technical
- [ ] No JavaScript
- [ ] No external dependencies
- [ ] Valid HTML5
- [ ] Works in Shadow DOM environment

---

## Common Mistakes to Avoid

### ❌ WRONG: Using Tailwind Classes
```html
<div class="flex justify-between p-4 text-xl">
  <!-- This will NOT work - Tailwind not loaded -->
</div>
```

### ✅ CORRECT: Using Vanilla CSS
```html
<style>
  .header {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    font-size: 20px;
  }
</style>
<div class="header">
  <!-- This works -->
</div>
```

### ❌ WRONG: No page structure
```html
<body>
  <h1>Title</h1>
  <p>Content...</p>
</body>
```

### ✅ CORRECT: Proper page structure
```html
<body>
  <div class="pdf-page">
    <h1>Title</h1>
    <p>Content...</p>
  </div>
</body>
```

### ❌ WRONG: Content overflow
```html
<div class="pdf-page">
  <!-- 2000px of content in a 1047px space -->
  <h2>Section 1</h2>
  <p>Very long content...</p>
  <!-- ... 20 more sections ... -->
</div>
```

### ✅ CORRECT: Split across pages
```html
<div class="pdf-page">
  <h2>Section 1</h2>
  <p>Content that fits...</p>
</div>

<div class="pdf-page">
  <h2>Section 2</h2>
  <p>More content...</p>
</div>
```

---

## AI Generation Workflow

When the AI receives a document generation request:

1. **Analyze Request**
   - Determine document type (resume, cover letter, other)
   - Estimate content volume
   - Calculate required pages

2. **Structure Document**
   - Plan section hierarchy
   - Decide page breaks
   - Allocate content to pages

3. **Generate HTML**
   - Start with DOCTYPE and full HTML structure
   - Add complete CSS in `<style>` tag
   - Create `<div class="pdf-page">` containers
   - Fill with semantic HTML content
   - Ensure proper spacing and margins

4. **Validate Output**
   - Check all tags are closed
   - Verify no Tailwind classes
   - Confirm page structure
   - Ensure content fits within page limits

5. **Return Clean HTML**
   - NO markdown code fences (` ```html `)
   - NO explanations or comments outside HTML
   - JUST the raw, valid HTML5 document

---

## Example: Complete 2-Page Resume

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jane Smith - Software Engineer Resume</title>
  <style>
    .pdf-page {
      width: 794px;
      height: 1123px;
      min-height: 1123px;
      margin: 20px auto;
      padding: 38px;
      box-sizing: border-box;
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      position: relative;
      page-break-after: always;
      break-after: page;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f5f5f5;
    }
    
    h1 {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1a1a1a;
    }
    
    .contact-info {
      font-size: 14px;
      color: #555;
      margin-bottom: 24px;
    }
    
    h2 {
      font-size: 22px;
      font-weight: 600;
      margin: 24px 0 12px 0;
      color: #1a1a1a;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 4px;
    }
    
    .job-title {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .job-meta {
      font-size: 14px;
      color: #666;
      margin-bottom: 12px;
    }
    
    ul {
      margin: 0 0 16px 0;
      padding-left: 24px;
    }
    
    li {
      margin-bottom: 6px;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <!-- PAGE 1 -->
  <div class="pdf-page">
    <h1>Jane Smith</h1>
    <div class="contact-info">
      jane.smith@example.com | +1 (555) 123-4567 | San Francisco, CA | linkedin.com/in/janesmith
    </div>
    
    <h2>Professional Summary</h2>
    <p>
      Senior Software Engineer with 8+ years of experience building scalable web applications 
      and leading engineering teams. Expertise in React, Node.js, and cloud infrastructure.
    </p>
    
    <h2>Professional Experience</h2>
    
    <div class="job-title">Senior Software Engineer</div>
    <div class="job-meta">Tech Innovations Inc. | San Francisco, CA | Jan 2020 - Present</div>
    <ul>
      <li>Led team of 5 engineers to rebuild customer dashboard, improving load time by 60%</li>
      <li>Architected microservices infrastructure on AWS, reducing costs by 40%</li>
      <li>Mentored junior developers through code reviews and pair programming sessions</li>
    </ul>
    
    <div class="job-title">Software Engineer</div>
    <div class="job-meta">Digital Solutions Co. | San Francisco, CA | Jun 2017 - Dec 2019</div>
    <ul>
      <li>Developed React-based SaaS platform serving 50,000+ users</li>
      <li>Implemented CI/CD pipeline reducing deployment time from hours to minutes</li>
      <li>Collaborated with product team to define technical requirements</li>
    </ul>
    
    <div class="job-title">Junior Software Developer</div>
    <div class="job-meta">StartupXYZ | Oakland, CA | May 2015 - May 2017</div>
    <ul>
      <li>Built RESTful APIs using Node.js and Express</li>
      <li>Created responsive UI components with React and Redux</li>
    </ul>
  </div>
  
  <!-- PAGE 2 -->
  <div class="pdf-page">
    <h2>Education</h2>
    <div class="job-title">Bachelor of Science in Computer Science</div>
    <div class="job-meta">University of California, Berkeley | 2011 - 2015</div>
    <p>GPA: 3.8/4.0 | Dean's List 2013-2015</p>
    
    <h2>Technical Skills</h2>
    <div class="skills-grid">
      <div>
        <strong>Languages:</strong><br>
        JavaScript, TypeScript, Python, Java
      </div>
      <div>
        <strong>Frontend:</strong><br>
        React, Vue.js, HTML5, CSS3
      </div>
      <div>
        <strong>Backend:</strong><br>
        Node.js, Express, Django, PostgreSQL
      </div>
      <div>
        <strong>DevOps:</strong><br>
        AWS, Docker, Kubernetes, CI/CD
      </div>
    </div>
    
    <h2>Certifications</h2>
    <ul>
      <li>AWS Certified Solutions Architect - Associate (2022)</li>
      <li>Google Cloud Professional Cloud Architect (2021)</li>
    </ul>
    
    <h2>Projects</h2>
    <div class="job-title">Open Source Contributor</div>
    <ul>
      <li>Core contributor to popular React UI library with 10k+ stars on GitHub</li>
      <li>Maintain CLI tool for developers with 5k+ weekly downloads</li>
    </ul>
  </div>
</body>
</html>
```

---

## Summary

The AI **MUST** generate documents that:
1. Use **ONLY vanilla CSS** and semantic HTML
2. Structure all content in `<div class="pdf-page">` containers
3. Respect the **1047px content height** per page
4. Generate **1-10 pages** as needed
5. Return **clean HTML** without markdown fences or explanations
6. Follow professional, traditional design principles
7. Work perfectly in the Shadow DOM environment

This ensures perfect PDF generation and consistent WYSIWYG preview.

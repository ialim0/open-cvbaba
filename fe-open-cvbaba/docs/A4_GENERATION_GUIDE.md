# High-Quality A4 Document Generation Guide

## 🎯 The Core Concept: "Usable Content Area"

To generate perfect A4 documents, you must understand that **the page is not a blank canvas**. It is a container with pre-defined padding.

### The Mathematics of Your Page

| Dimension | Value (px) | Value (mm) | Notes |
| :--- | :--- | :--- | :--- |
| **Total Page Width** | **794px** | 210mm | Fixed A4 Width |
| **Total Page Height** | **1123px** | 297mm | Fixed A4 Height |
| **Padding (Margins)** | **38px** | ~10mm | Applied on all sides |
| **USABLE WIDTH** | **718px** | ~190mm | **Your Design Space** |
| **USABLE HEIGHT** | **1047px** | ~277mm | **Your Design Space** |

---

## 🏗️ Technical Specification (The "Contract")

Any HTML generator (AI or manual) **MUST** follow these rules to ensure the preview matches the PDF output.

### 1. The Container
*   **Root Element:** `<div class="pdf-page">`
*   **CSS Box Model:** `border-box` (Width includes padding)

### 2. The Coordinate System
*   **0,0 Point:** Top-left of the *content area* (38px, 38px from paper edge).
*   **Max Width:** `100%` (which equals **718px**).
*   **Max Height:** `1047px` before a new page is needed.

### 3. Margin & Padding Logic
*   **System Padding:** The system forces `padding: 38px` on the `.pdf-page`.
*   **Do NOT** add `margin` to the body or main container.
*   **Full Bleed:** To touch the paper edge, use `margin: -38px`.

### 4. Page Breaks
*   **Manual:** Close the current `.pdf-page` div and open a new one.
*   **Automatic:** The system will detect overflow > 1123px and attempt to split, but manual splitting is always cleaner.

---

## 🛠️ How to Generate High-Quality Code

### 1. Respect the Container
The system wraps your content in a `.pdf-page` div. This div **already has padding**.

**❌ WRONG (Double Margins):**
```html
<div class="pdf-page">
  <div style="margin: 40px;"> <!-- DON'T DO THIS -->
    <h1>Title</h1>
  </div>
</div>
```
*Result:* The content will be squished into a tiny box (38px padding + 40px margin = 78px empty space).

**✅ CORRECT (Full Width):**
```html
<div class="pdf-page">
  <h1>Title</h1> <!-- Starts exactly at the 38px mark -->
</div>
```

### 2. Full-Bleed Backgrounds (The "Hack")
If you want a sidebar that goes *all the way to the edge* (ignoring the 38px padding), you must use negative margins.

**The "Full Bleed" Formula:**
*   Margin: `-38px` (to pull it back to the edge)
*   Padding: `38px` (to push content back to the safe zone)

**Example: Sidebar with Full Bleed**
```html
<div class="pdf-page" style="display: flex;">
  
  <!-- Sidebar with Full Bleed -->
  <div style="
    width: 30%; 
    background-color: #333; /* OR ANY COLOR YOU WANT */
    color: white;
    margin: -38px 0 -38px -38px; /* Pull to edges: Top, Right, Bottom, Left */
    padding: 38px 20px; /* Restore padding */
    min-height: 1123px; /* Force full height */
  ">
    <h3>Contact</h3>
  </div>

  <!-- Main Content -->
  <div style="width: 70%; padding-left: 20px;">
    <h1>John Doe</h1>
  </div>

</div>
```

### 3. Font Sizing for Print
Screen pixels are different from print points. For high-quality A4 reading:

*   **Body Text:** `14px` - `16px` (Readable standard)
*   **Small Text:** `12px` (Metadata, dates)
*   **Headings:** `24px` - `36px`

*Avoid going below 12px unless necessary, as it becomes hard to read on paper.*

### 4. Image Quality
Since the PDF generation uses a 1:1 pixel mapping (794px width), images should be sized appropriately.

*   **Profile Photos:** Use at least `300x300px` source images for crispness.
*   **Logos:** SVG is best. If PNG, ensure it's high resolution.

### 5. The "Safe Zone"
Even though the usable width is 718px, avoid putting critical text right at the edge of that 718px if you can avoid it.
*   **Best Practice:** Add an internal padding of `10-20px` inside your sections for "breathing room."

---

## 🚀 Summary Checklist

1.  **Design for 718px Width**, not 794px.
2.  **Don't add body margins**; the system does it for you.
3.  **Use Negative Margins (-38px)** ONLY if you need a colored background to touch the edge of the paper.
4.  **Keep content under 1047px** height per page.
5.  **Use High-Res Images** scaled down with CSS.

Follow these rules, and your `html-to-pdf` pipeline will produce professional, print-ready documents every time.

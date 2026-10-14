// scripts/assemble_black_book.cjs
const fs = require('fs');
const path = require('path');

const { getFrontMatterPages } = require('./pages/front_matter.cjs');
const { getChapter1Pages } = require('./pages/chapter1.cjs');
const { getChapter2Pages } = require('./pages/chapter2.cjs');
const { getChapter3Pages } = require('./pages/chapter3.cjs');
const { getChapter4Pages } = require('./pages/chapter4.cjs');
const { getChapters5To8Pages } = require('./pages/chapter5_to_8.cjs');

console.log("Assembling complete Academic Project Report (Black Book)...");

const htmlHeader = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kadjai Travels — Academic Project Report (Black Book)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-navy: #0B132B;
      --secondary-slate: #1C2541;
      --accent-gold: #C59B27;
      --accent-teal: #0D9488;
      --border-dark: #222222;
      --border-light: #CCCCCC;
      --text-dark: #111111;
      --text-muted: #555555;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #525659;
      font-family: 'Crimson Pro', Georgia, serif;
      color: var(--text-dark);
      font-size: 10.5pt;
      line-height: 1.42;
      -webkit-font-smoothing: antialiased;
    }

    /* Screen Control Bar */
    .screen-control-bar {
      position: sticky;
      top: 0;
      z-index: 9999;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
    }
    .screen-control-bar .title {
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-print {
      background: linear-gradient(135deg, #009bb4, #008298);
      color: #ffffff;
      font-weight: 800;
      padding: 8px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-print:hover {
      background: #007386;
      box-shadow: 0 4px 12px rgba(0, 155, 180, 0.4);
    }

    /* Document Viewport */
    .document-viewport {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0 60px 0;
      gap: 24px;
    }

    /* Individual A4 Page */
    .a4-page {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      padding: 16mm 18mm 14mm 18mm;
      position: relative;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      border: 1px solid #d1d5db;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      page-break-inside: avoid;
      overflow: hidden;
    }

    /* Academic Double Outer Border Frame */
    .page-frame {
      position: absolute;
      top: 10mm;
      left: 12mm;
      right: 12mm;
      bottom: 10mm;
      border: 1.5pt solid var(--border-dark);
      pointer-events: none;
    }
    .page-frame::after {
      content: '';
      position: absolute;
      top: 1.5mm;
      left: 1.5mm;
      right: 1.5mm;
      bottom: 1.5mm;
      border: 0.5pt solid var(--border-dark);
    }

    /* Running Academic Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 9.2pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #222222;
      border-bottom: 0.75pt solid #444444;
      padding-bottom: 3px;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    /* Running Academic Footer */
    .page-footer {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 9.2pt;
      font-weight: 600;
      color: #333333;
      border-top: 0.75pt solid #444444;
      padding-top: 3px;
      margin-top: 10px;
    }

    /* Page Content Body */
    .page-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* Typography */
    h1.chapter-title {
      font-family: 'Cinzel', serif;
      font-size: 14.5pt;
      font-weight: 800;
      text-align: center;
      letter-spacing: 1px;
      margin-bottom: 2px;
      color: #000000;
    }
    h2.chapter-subtitle {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11.5pt;
      font-weight: 800;
      text-align: center;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 10px;
      color: #111111;
    }
    h3.section-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 10pt;
      font-weight: 700;
      margin-top: 8px;
      margin-bottom: 4px;
      color: #000000;
    }
    p {
      text-align: justify;
      margin-bottom: 6px;
      font-size: 9.8pt;
      line-height: 1.4;
    }

    ul.academic-list, ol.academic-list {
      margin-left: 18px;
      margin-bottom: 6px;
      font-size: 9.2pt;
      line-height: 1.35;
    }
    ul.academic-list li, ol.academic-list li {
      margin-bottom: 3.5px;
      text-align: justify;
    }

    /* Academic Tables */
    table.academic-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.2pt;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin-top: 4px;
      margin-bottom: 8px;
    }
    table.academic-table th, 
    table.academic-table td {
      border: 0.75pt solid #333333;
      padding: 4px 5.5px;
      vertical-align: top;
      line-height: 1.25;
    }
    table.academic-table th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
      text-align: left;
    }
    table.academic-table td.center {
      text-align: center;
    }

    /* Figure Containers */
    .figure-container {
      margin: 6px auto;
      text-align: center;
      width: 100%;
    }
    .figure-caption {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      font-size: 8.5pt;
      margin-top: 4px;
      color: #111111;
    }

    /* Code Blocks */
    pre.code-block {
      background: #f8fafc;
      border: 0.75pt solid #94a3b8;
      border-radius: 4px;
      padding: 5px 7px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      line-height: 1.28;
      color: #0f172a;
      white-space: pre-wrap;
      word-break: break-all;
      margin-bottom: 6px;
    }

    /* Vector SVG Diagram Styles */
    svg.vector-diag {
      width: 100%;
      border: 0.5pt solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
    }

    /* Cover Page Styles */
    .cover-page {
      padding: 20mm 22mm;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }

    @media print {
      body {
        background: transparent !important;
        padding: 0 !important;
      }
      .screen-control-bar {
        display: none !important;
      }
      .document-viewport {
        padding: 0 !important;
        gap: 0 !important;
      }
      .a4-page {
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        width: 210mm !important;
        height: 297mm !important;
        page-break-after: always !important;
        page-break-inside: avoid !important;
      }
      @page {
        size: A4 portrait;
        margin: 0;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Action Bar -->
  <div class="screen-control-bar">
    <div class="title">
      <span>📘</span> Kadjai Travels — Academic Project Report (Black Book)
      <span style="font-weight: normal; color: #94a3b8; margin-left: 8px;">(Candidate: Yash Ramasre Bhagat, Roll No: T072)</span>
    </div>
    <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="document-viewport">
`;

const allPages = [
  ...getFrontMatterPages(),
  ...getChapter1Pages(),
  ...getChapter2Pages(),
  ...getChapter3Pages(),
  ...getChapter4Pages(),
  ...getChapters5To8Pages()
];

const htmlFooter = `
  </div>
</body>
</html>
`;

const completeHtml = htmlHeader + allPages.join('\n') + htmlFooter;

const outputPath = path.resolve(__dirname, '../docs/kadjai-travels-black-book-report.html');
fs.writeFileSync(outputPath, completeHtml, 'utf8');

console.log(`Successfully generated Black Book HTML!`);
console.log(`Total A4 Pages assembled: ${allPages.length}`);
console.log(`File saved to: ${outputPath} (${(completeHtml.length / 1024).toFixed(1)} KB)`);

// scripts/build_complete_black_book.cjs
// Assembles the complete 51-page Academic Project Report (Black Book) for Kadjai Travels
// Student: Yash Ramasre Bhagat (T072) | College: Sheth L.U.J. & Sir M.V. College

const fs = require('fs');
const path = require('path');

console.log("Starting Black Book assembly...");

// Helper for A4 page container
function wrapPage(id, content, pageNum = null, isCover = false) {
  if (isCover) {
    return `
    <!-- COVER PAGE -->
    <div class="a4-page cover-page" id="${id}">
      <div class="page-frame"></div>
      ${content}
    </div>`;
  }

  if (pageNum === null) {
    // Front matter pages (no running header/footer numbers)
    return `
    <div class="a4-page" id="${id}">
      <div class="page-frame"></div>
      <div class="page-body">
        ${content}
      </div>
    </div>`;
  }

  // Chapter body pages (1 to 44)
  return `
    <div class="a4-page" id="${id}">
      <div class="page-frame"></div>
      <div class="page-header">
        <span>YASH BHAGAT T072</span>
        <span>SHETH L.U.J AND SIR M.V. COLLEGE</span>
      </div>
      <div class="page-body">
        ${content}
      </div>
      <div class="page-footer">
        <span>Page ${pageNum} of 44</span>
      </div>
    </div>`;
}

// College crest SVG
const collegeCrestSvg = `
<div class="college-crest-svg" style="margin: 10px auto; text-align: center;">
  <svg width="110" height="110" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer Shield Crest -->
    <path d="M 60,5 C 95,5 110,25 110,55 C 110,95 60,115 60,115 C 60,115 10,95 10,55 C 10,25 25,5 60,5 Z" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
    <path d="M 60,10 C 90,10 104,28 104,55 C 104,90 60,108 60,108 C 60,108 16,90 16,55 C 16,28 30,10 60,10 Z" fill="none" stroke="#000000" stroke-width="1"/>
    <!-- Motto Ribbon Arc Top -->
    <path d="M 24,30 Q 60,18 96,30 L 93,37 Q 60,26 27,37 Z" fill="#F8FAFC" stroke="#000000" stroke-width="1"/>
    <text x="60" y="27" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="5.2" font-weight="bold" text-anchor="middle" fill="#000000">विद्या धनम् सर्व धनम् प्रधानम्</text>
    <!-- Center Dividing Cross -->
    <line x1="60" y1="36" x2="60" y2="88" stroke="#000000" stroke-width="1.2"/>
    <line x1="22" y1="62" x2="98" y2="62" stroke="#000000" stroke-width="1.2"/>
    <!-- Top Left: Book / Diya -->
    <path d="M 36,44 Q 46,40 54,45 L 54,54 Q 46,49 36,53 Z" fill="#000000"/>
    <path d="M 38,40 Q 42,35 44,42 Z" fill="#D97706"/>
    <!-- Top Right: Rising Sun -->
    <circle cx="78" cy="50" r="7" fill="#E11D48"/>
    <path d="M 70,50 L 86,50 M 78,42 L 78,58 M 72,44 L 84,56 M 72,56 L 84,44" stroke="#E11D48" stroke-width="1"/>
    <!-- Bottom Left: Quill & Ink -->
    <path d="M 35,78 L 48,68 L 50,72 L 37,82 Z" fill="#000000"/>
    <!-- Bottom Right: Lamp of Knowledge -->
    <path d="M 72,80 Q 80,75 88,80 L 80,84 Z" fill="#000000"/>
    <!-- Center Ribbon: ESTD 1963 -->
    <rect x="36" y="88" width="48" height="12" rx="3" fill="#000000"/>
    <text x="60" y="97" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="6.5" font-weight="900" text-anchor="middle" fill="#FFFFFF" letter-spacing="1">ESTD 1963</text>
  </svg>
</div>`;

console.log("Building front matters...");

const fs = require('fs');
const content = fs.readFileSync('docs/kadjai-travels-black-book-report.html', 'utf8');
const pages = content.split(/<div class="a4-page/g);

console.log(`Total split chunks: ${pages.length}`);
pages.slice(1).forEach((p, idx) => {
  const pageIdMatch = p.match(/id="([^"]+)"/);
  const id = pageIdMatch ? pageIdMatch[1] : 'unknown';
  const footerMatch = p.match(/<div class="page-footer">([\s\S]*?)<\/div>/);
  const footer = footerMatch ? footerMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'NO FOOTER';
  console.log(`P${idx+1}: id="${id}", footer="${footer}", length=${p.length}`);
});

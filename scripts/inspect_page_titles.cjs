const fs = require('fs');
const content = fs.readFileSync('docs/kadjai-travels-black-book-report.html', 'utf8');
const pages = content.split(/<div class="a4-page/g);

pages.slice(1).forEach((p, idx) => {
  const pageNum = idx + 1;
  const headerMatch = p.match(/<div class="page-header">([\s\S]*?)<\/div>/);
  const footerMatch = p.match(/<div class="page-footer">([\s\S]*?)<\/div>/);
  const titleMatch = p.match(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/);
  const hText = headerMatch ? headerMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'NO HEADER';
  const fText = footerMatch ? footerMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'NO FOOTER';
  const tText = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'NO TITLE';
  console.log(`P${pageNum}: Title="${tText.substring(0, 45)}" | Header="${hText.substring(0, 40)}" | Footer="${fText.substring(0, 30)}"`);
});

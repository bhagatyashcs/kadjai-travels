const fs = require('fs');
const content = fs.readFileSync('docs/kadjai-travels-black-book-report.html', 'utf8');

function extractFigure(figNum) {
  const idx = content.indexOf(`Figure ${figNum}`);
  if (idx === -1) return null;
  // find previous <svg
  const svgStart = content.lastIndexOf('<svg', idx);
  const svgEnd = content.indexOf('</svg>', idx) > -1 ? content.indexOf('</svg>', idx) + 6 : content.indexOf('</svg>', svgStart) + 6;
  return content.substring(svgStart, svgEnd);
}

['2.1', '2.2', '3.1', '3.2.1', '3.2.2', '3.2.3', '3.2.4', '3.3.1', '3.3.2', '3.4.1', '3.5'].forEach(f => {
  const svg = extractFigure(f);
  console.log(`Figure ${f}: found=${!!svg}, length=${svg ? svg.length : 0}`);
});

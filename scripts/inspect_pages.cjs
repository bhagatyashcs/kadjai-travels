const fs = require('fs');
const content = fs.readFileSync('docs/kadjai-travels-black-book-report.html', 'utf8');
const lines = content.split('\n');
let count = 0;
lines.forEach((line, idx) => {
  if (line.includes('class="a4-page') || line.includes("class='a4-page'")) {
    count++;
    console.log(`Page ${count} (Line ${idx+1}): ${line.trim()}`);
  }
});
console.log(`Total A4 pages: ${count}`);

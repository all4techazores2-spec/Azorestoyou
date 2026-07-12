const fs = require('fs');
const content = fs.readFileSync('components/BusinessDashboard.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('table.number') || line.includes('t.number') || line.includes('table.id') || line.includes('t.id')) {
    if (line.includes('map(') || line.includes('div') || line.includes('span') || line.includes('p>')) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  }
});

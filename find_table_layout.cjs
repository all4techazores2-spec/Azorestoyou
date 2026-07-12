const fs = require('fs');
const content = fs.readFileSync('components/BusinessDashboard.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('className="grid grid-cols-') || line.includes('tables.map(table =>')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});

const fs = require('fs');
const content = fs.readFileSync('components/BusinessDashboard.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('unlink') || line.toLowerCase().includes('desvincular')) {
    console.log(`${idx + 1}: ${line}`);
  }
});

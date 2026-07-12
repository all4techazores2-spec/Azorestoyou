const fs = require('fs');
const content = fs.readFileSync('components/BusinessDashboard.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (idx >= 3790 && idx <= 4150) {
    if (line.includes('.items') || line.includes('map(') || line.includes('dish')) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  }
});

const fs = require('fs');
const content = fs.readFileSync('components/BusinessDashboard.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (idx >= 4000 && idx <= 5300) {
    if (line.includes('currentTab') && (line.includes('map(') || line.includes('forEach') || line.includes('.map'))) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  }
});

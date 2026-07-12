const fs = require('fs');
const content = fs.readFileSync('components/BusinessDashboard.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (idx >= 3948 && idx <= 5000) {
    if (line.includes('currentTab') || line.includes('tab') || line.includes('cart') || line.includes('dish')) {
      if (line.includes('map(') || line.includes('div') || line.includes('span')) {
        console.log(`${idx + 1}: ${line.trim()}`);
      }
    }
  }
});

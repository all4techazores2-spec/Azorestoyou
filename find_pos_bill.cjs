const fs = require('fs');
const content = fs.readFileSync('components/BusinessDashboard.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('currentTab') || line.includes('selectedTableId') || line.includes('selectedTable')) {
    if (line.includes('map(') || line.includes('render') || line.includes('currentTab.')) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  }
});

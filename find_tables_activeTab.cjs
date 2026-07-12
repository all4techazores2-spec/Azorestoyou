const fs = require('fs');
const content = fs.readFileSync('components/BusinessDashboard.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes("activeTab === 'tables'") || line.includes("activeTab === 'rooms'") || line.includes("activeTab === 'pos'")) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});

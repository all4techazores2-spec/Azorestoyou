const fs = require('fs');
const content = fs.readFileSync('components/BusinessDashboard.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('onSync(') || line.includes('onSync)')) {
    console.log(`${idx + 1}: ${line}`);
  }
});

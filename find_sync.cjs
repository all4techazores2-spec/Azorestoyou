const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('Real-time sync')) {
    console.log(`${idx + 1}: ${line}`);
  }
});

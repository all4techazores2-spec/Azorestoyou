const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('fetchData =') || line.includes('function fetchData') || line.includes('const fetchData')) {
    console.log(`${idx + 1}: ${line}`);
  }
});

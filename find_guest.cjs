const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('guest') || line.toLowerCase().includes('qrcode') || line.toLowerCase().includes('qr=')) {
    console.log(`${idx + 1}: ${line}`);
  }
});

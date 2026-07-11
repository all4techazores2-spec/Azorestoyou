const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('type="password"') || line.toLowerCase().includes('palavra-passe') || line.toLowerCase().includes('placeholder="email"')) {
    console.log(`${idx + 1}: ${line}`);
  }
});

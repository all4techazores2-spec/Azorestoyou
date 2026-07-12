const fs = require('fs');

function searchFile(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('kitchenOrders') || line.includes('setKitchenOrders') || line.includes('kitchen') || line.includes('cozinha')) {
      if (line.includes('=') || line.includes('fetch') || line.includes('push') || line.includes('map')) {
        console.log(`${filename}:${idx + 1}: ${line.trim()}`);
      }
    }
  });
}

searchFile('App.tsx');
searchFile('components/BusinessDashboard.tsx');

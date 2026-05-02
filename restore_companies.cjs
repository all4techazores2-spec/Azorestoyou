const fs = require('fs');

let content = fs.readFileSync('constants.ts', 'utf8');

// The COMPANIES block was likely right before the GENERATED_SCHEDULES line
const genStart = content.indexOf('const GENERATED_SCHEDULES: BusSchedule[] = [];');

if (genStart !== -1) {
  const companiesBlock = `const COMPANIES: Record<string, string[]> = {
    'PDL': ['Auto Viação Micaelense', 'Varela', 'CRP'],
    'TER': ['EVT'],
    'HOR': ['Farias'],
    'PIX': ['A.V.P.'],
    'SJZ': ['Transmaia'],
    'SMA': ['Melo Turismo'],
    'GRW': ['Serrão'],
    'FLW': ['UTC'],
    'CVU': ['Táxi']
  };\n\n`;
  
  content = content.substring(0, genStart) + companiesBlock + content.substring(genStart);
  fs.writeFileSync('constants.ts', content, 'utf8');
  console.log("Restored COMPANIES constant.");
} else {
  console.log("Could not find GENERATED_SCHEDULES to insert COMPANIES.");
}

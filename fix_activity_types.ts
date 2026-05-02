import fs from 'fs';

const dbPath = './db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// The IDs of all the 41 activities we added start with A_SM, A_TER, A_PIC, A_FAI, A_SJG, A_GRW, A_FLW, A_CVU
// Let's just find them and change their type to 'activity'
const injectedPrefixes = ['A_SM', 'A_TER', 'A_PIC', 'A_FAI', 'A_SJG', 'A_GRW', 'A_FLW', 'A_CVU'];

let count = 0;
if (db.activities) {
  db.activities.forEach(item => {
    if (injectedPrefixes.some(prefix => item.id.startsWith(prefix))) {
      item.type = 'activity';
      count++;
    }
  });
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

// Also fix constants.ts
let constantsContent = fs.readFileSync('constants.ts', 'utf8');
injectedPrefixes.forEach(prefix => {
  // Regex to find type: "something" and replace with type: "activity" for these IDs
  // Since they are written like: { id: "A_SM1", title: "...", type: "landscape",
  const regex = new RegExp(`(id:\\s*["']${prefix}\\w*["'].*?type:\\s*["'])[a-z]+(["'])`, 'gi');
  constantsContent = constantsContent.replace(regex, `$1activity$2`);
});

fs.writeFileSync('constants.ts', constantsContent);

console.log(`Updated ${count} activities to type='activity'`);

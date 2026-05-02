const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'constants.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update DATA type
content = content.replace(
    /shops: Restaurant\[\];\s*}> = {/,
    'shops: Restaurant[];\n  services: Restaurant[];\n}> = {'
);

// 2. Add services: [] to pt
content = content.replace(
    /shops: \[\s*[\s\S]*?id: 'S33'[\s\S]*?\]\s*\}/,
    (match) => match.replace(']', '],\n    services: []')
);

// 3. Add services: [] to en
// Find the en section and shops array
const enStart = content.indexOf('en: {');
let enSection = content.substring(enStart);
enSection = enSection.replace(
    /shops: \[\s*[\s\S]*?\]\s*\}/,
    (match) => match.replace(']', '],\n    services: []')
);
content = content.substring(0, enStart) + enSection;

// 4. Add getServices export
if (!content.includes('export const getServices')) {
    content += `
export const getServices = (lang: Language = 'pt'): Restaurant[] => {
  return (DATA[lang] && (DATA[lang] as any).services) ? (DATA[lang] as any).services : (DATA['pt'] as any).services;
};
`;
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ constants.ts updated successfully with services support!');

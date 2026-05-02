const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'db.json');
let content = fs.readFileSync(filePath, 'utf8');

const mapping = {
    'Ã£': 'ã',
    'Ã§': 'ç',
    'Ãº': 'ú',
    'Ãª': 'ê',
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ã´': 'ô',
    'Ãµ': 'õ',
    'Ã€': 'À',
    'Ã‰': 'É',
    'Á ': 'à',
    'Á¢': 'â',
    'Â ': ' ',
    'AA ': 'Aç', // Specific fix for 'Frio AA ores'
    'aA o': 'aç', // Specific fix for 'aA oriana'
};

for (const [broken, fixed] of Object.entries(mapping)) {
    content = content.split(broken).join(fixed);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ db.json encoding fixed!');

import fs from 'fs';

let content = fs.readFileSync('constants.ts', 'utf8');

content = content.replace(/FajA/g, 'Fajã');
content = content.replace(/Asteis/g, 'Úteis');
content = content.replace(/SAbados/g, 'Sábados');
content = content.replace(/CAo/g, 'Cão');
content = content.replace(/SAo/g, 'São');
content = content.replace(/PA3pulo/g, 'Pópulo');
content = content.replace(/VulcAes/g, 'Vulcões');
content = content.replace(/JoAo/g, 'João');

fs.writeFileSync('constants.ts', content, 'utf8');
console.log("Fixed encoding in constants.ts");

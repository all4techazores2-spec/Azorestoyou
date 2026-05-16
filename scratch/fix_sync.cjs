const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'components', 'AdminDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const startPattern = /for \(const listObj of lists\) \{/;
const endPattern = /addLog\(`✅ Categoria \$\{listObj\.title\} concluída\.`\);/;

const newLoop = `      for (const listObj of lists) {
        addLog(\`📂 Categoria: \${listObj.title}...\`);
        
        const itemsToSync = listObj.data;
        const categoryLabel = listObj.label;
        
        addLog(\`📤 A enviar \${itemsToSync.length} itens de \${listObj.title} em bloco...\`);
        
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', \`\${API_BASE_URL}/api/\${categoryLabel}?mode=merge\`, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setCompressionLabel(\`A enviar \${listObj.title}: \${percentComplete}%\`);
              setCompressionProgress({ 
                current: processedCount + (itemsToSync.length * (event.loaded / event.total)), 
                total: totalItems 
              });
            }
          };
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(\`Erro do servidor na categoria \${listObj.title} (\${xhr.status}): \${xhr.responseText}\`));
            }
          };
          
          xhr.onerror = () => reject(new Error(\`Erro de rede ao enviar \${listObj.title}.\`));
          xhr.ontimeout = () => reject(new Error(\`Timeout ao enviar \${listObj.title}.\`));
          
          xhr.send(JSON.stringify(itemsToSync));
        });
        
        processedCount += itemsToSync.length;
        setCompressionProgress({ current: processedCount, total: totalItems });
        addLog(\`✅ Categoria \${listObj.title} concluída.\`);
`;

// Find the start and end indices
const startIndex = content.indexOf('for (const listObj of lists) {');
const endIndex = content.indexOf('addLog(`✅ Categoria ${listObj.title} concluída.`);') + 'addLog(`✅ Categoria ${listObj.title} concluída.`);'.length;

if (startIndex !== -1 && endIndex !== -1) {
    const updatedContent = content.substring(0, startIndex) + newLoop + content.substring(endIndex);
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log("Successfully updated AdminDashboard.tsx");
} else {
    console.error("Could not find start or end markers");
    console.log("startIndex:", startIndex);
    console.log("endIndex:", endIndex);
}

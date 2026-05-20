const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// Use \n since file uses Unix line endings
const NL = '\n';

const oldBlock = [
  "     try {",
  "        await fetch(`${API_BASE_URL}/api/reservations/${tableMenuRes.id}/append-order`, {",
  "          method: 'POST',",
  "          headers: { 'Content-Type': 'application/json' },",
  "          body: JSON.stringify({ items }),",
  "       });",
  "        alert('\u{1F6CE}\uFE0F Pedido enviado com sucesso! Aguarde a confirma\u00E7\u00E3o do restaurante.');",
  "     } catch (err) { console.error(err); }",
  "     setTableMenuRes(null);",
  "  };"
].join(NL);

const newBlock = [
  "     try {",
  "        const orderResp = await fetch(`${API_BASE_URL}/api/reservations/${tableMenuRes.id}/append-order`, {",
  "          method: 'POST',",
  "          headers: { 'Content-Type': 'application/json' },",
  "          body: JSON.stringify({ items }),",
  "       });",
  "        if (orderResp.ok) {",
  "          alert('\u{1F6CE}\uFE0F Pedido enviado com sucesso! Aguarde a confirma\u00E7\u00E3o do restaurante.');",
  "          // Resync restaurants so table alertStatus & pendingOrderItems are up-to-date for kitchen monitor",
  "          await fetchData(0, ['restaurants']);",
  "          // Resync current user reservations so order tracker reflects the new preOrder",
  "          if (userProfile?.email) {",
  "            try {",
  "              const userResp = await fetch(`${API_BASE_URL}/api/users/${userProfile.email}?t=${Date.now()}`);",
  "              if (userResp.ok) { const userData = await userResp.json(); setMyReservations(userData.reservations || []); }",
  "            } catch (e) { console.error('Sync user reservations error:', e); }",
  "          }",
  "        } else {",
  "          alert('\u274C N\u00E3o foi poss\u00EDvel enviar o pedido. Tente novamente.');",
  "        }",
  "     } catch (err) { console.error(err); alert('\u274C Erro de liga\u00E7\u00E3o ao servidor.'); }",
  "     setTableMenuRes(null);",
  "  };"
].join(NL);

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync('App.tsx', code, 'utf8');
  console.log('SUCCESS: App.tsx updated');
} else {
  console.log('Block NOT found. Trying to show the raw section around line 1167...');
  const raw = fs.readFileSync('App.tsx');
  // Find 'append-order' in raw buffer
  const marker = Buffer.from('append-order');
  let pos = raw.indexOf(marker);
  if (pos >= 0) {
    // Find start of try block by going backwards
    const section = raw.slice(pos - 200, pos + 400).toString('utf8');
    console.log('RAW SECTION:', JSON.stringify(section));
  }
}

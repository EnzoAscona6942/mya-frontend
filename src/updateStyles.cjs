const fs = require('fs');
const path = require('path');

const newPalette = `const C = {
  bg: '#F5F5F3', 
  white: '#FFFFFF',
  sidebar: '#0A0A0A',
  text: '#171717',
  textMid: '#52525B',
  textLight: '#A1A1AA',
  border: 'rgba(0,0,0,0.15)',
  accent: '#10B981',
  accentHov: '#059669',
  accentBg: '#D1FAE5',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  amber: '#F59E0B',
  amberBg: '#FEF3C7',
  blue: '#3B82F6',
  blueBg: '#DBEAFE'
};`;

const pagesPath = path.join(__dirname, 'pages');

const files = ['POS.jsx', 'Stock.jsx', 'Reportes.jsx', 'Productos.jsx', 'CierreCaja.jsx', 'Login.jsx'];

files.forEach(f => {
  const file = path.join(pagesPath, f);
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // Replace palette (up to 25 lines to catch it all)
  code = code.replace(/const C = \{[\s\S]*?\n\};/, newPalette);

  // Replace borders to make them sharp
  code = code.replace(/borderRadius:\s*\d+/g, 'borderRadius: 0');
  code = code.replace(/1\.5px solid/g, '1px solid');
  
  // Replace box shadows
  code = code.replace(/boxShadow:\s*(['\"\`])[^'\"\`]+\1/g, 'boxShadow: "none"');

  // Replace font families to make it look rigorous and Monospaced
  // Only replace 'Sora', sans-serif if it's the general text. But we want monospace everywhere.
  code = code.replace(/'Sora', sans-serif/g, "'DM Mono', monospace");

  fs.writeFileSync(file, code);
});
console.log('Styles updated.');

const fs = require('fs');
let c = fs.readFileSync('app/page.tsx', 'utf8');
c = c.replace(/ðŸ‡¯ðŸ‡µ/g, '🇯🇵');
c = c.replace(/ðŸ‡°ðŸ‡·/g, '🇰🇷');
c = c.replace(/ðŸ‡¨ðŸ‡³/g, '🇨🇳');
c = c.replace(/ðŸ”ž/g, '🔞');
fs.writeFileSync('app/page.tsx', c, 'utf8');
console.log('Emojis fixed');

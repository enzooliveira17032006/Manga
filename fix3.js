const fs = require('fs');

const path = 'app/pornhwa/page.tsx';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(/ðŸ”ž/g, '🔞');
c = c.replace(/ConteÃºdo/g, 'Conteúdo');
c = c.replace(/conteÃºdo/g, 'conteúdo');
c = c.replace(/seÃ§Ã£o/g, 'seção');
c = c.replace(/contÃ©m/g, 'contém');
c = c.replace(/vocÃª/g, 'você');
c = c.replace(/jurisdiÃ§Ã£o/g, 'jurisdição');
c = c.replace(/seguranÃ§a/g, 'segurança');

fs.writeFileSync(path, c, 'utf8');
console.log('Fixed', path);

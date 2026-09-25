const fs = require('fs');
let c = fs.readFileSync('components/ChapterList.tsx', 'utf8');

c = c.replace(/Nenhum cap.*?tulo PT-BR dispon.*?vel no momento\./, 'Nenhum \u0063\u0061\u0070\u00ED\u0074\u0075\u006C\u006F PT-BR \u0064\u0069\u0073\u0070\u006F\u006E\u00ED\u0076\u0065\u006C no momento.');
c = c.replace(/Cap.*?tulo \$\{ch\.number\}/, '\u0043\u0061\u0070\u00ED\u0074\u0075\u006C\u006F ${ch.number}');
c = c.replace(/Ler [^\n]+/, 'Ler \u2794');

fs.writeFileSync('components/ChapterList.tsx', c, 'utf8');

const fs = require('fs');

function fixFile(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  
  // Create a mapping using ONLY safe ASCII unicode escapes
  const replaces = [
    [/N\u00C3\u0083\u00C2\u00A3o/g, 'N\u00E3o'], // NÃƒÂ£o
    [/N\u00C3\u00A3o/g, 'N\u00E3o'], // NÃ£o
    [/N\u00C3\u00ADo/g, 'N\u00E3o'],
    [/N\u00C3\u00A3o/g, 'N\u00E3o'],
    [/poss\u00C3\u0083\u00C2\u00ADvel/g, 'poss\u00EDvel'], // possÃƒÂ­vel
    [/poss\u00C3\u00ADvel/g, 'poss\u00EDvel'],
    [/se\u00C3\u0083\u00C2\u00A7\u00C3\u0083\u00C2\u00A3o/g, 'se\u00E7\u00E3o'], // seÃƒÂ§ÃƒÂ£o
    [/se\u00C3\u00A7\u00C3\u00A3o/g, 'se\u00E7\u00E3o'],
    [/dispon\u00C3\u0083\u00C2\u00ADveis/g, 'dispon\u00EDveis'], // disponÃƒÂ­veis
    [/dispon\u00C3\u00ADveis/g, 'dispon\u00EDveis'],
    [/mang\u00C3\u0083\u00C2\u00A1/g, 'mang\u00E1'], // mangÃƒÂ¡
    [/mang\u00C3\u00A1/g, 'mang\u00E1'], // mangÃ¡
    [/Mang\u00C3\u0083\u00C2\u00A1/g, 'Mang\u00E1'], // MangÃƒÂ¡
    [/Mang\u00C3\u00A1/g, 'Mang\u00E1'], // MangÃ¡
    [/portugu\u00C3\u0083\u00C2\u00AA/g, 'portugu\u00EA'], // portuguÃƒÂª
    [/portugu\u00C3\u00AA/g, 'portugu\u00EA'], // portuguÃª
    [/experi\u00C3\u0083\u00C2\u00AAncia/g, 'experi\u00EAncia'], // experiÃƒÂªncia
    [/experi\u00C3\u00AAncia/g, 'experi\u00EAncia'], // experiÃªncia
    [/R\u00C3\u0083\u00C2\u00A1pidas/g, 'R\u00E1pidas'], // RÃƒÂ¡pidas
    [/R\u00C3\u00A1pidas/g, 'R\u00E1pidas'], // RÃ¡pidas
    [/Dispon\u00C3\u0083\u00C2\u00ADveis/g, 'Dispon\u00EDveis'], // DisponÃƒÂ­veis
    [/Dispon\u00C3\u00ADveis/g, 'Dispon\u00EDveis'], // DisponÃ­veis
    [/\u00C3\u00B0\u00C5\u00B8\u00E2\u0080\u00A1\u00C2\u00AF\u00C3\u00B0\u00C5\u00B8\u00E2\u0080\u00A1\u00C2\u00B5/g, '\uD83C\uDDEF\uD83C\uDDF5'], // Japan
    [/\u00F0\u009F\u0087\u00AF\u00F0\u009F\u0087\u00B5/g, '\uD83C\uDDEF\uD83C\uDDF5'], // Japan 2
    [/\u00C3\u00B0\u00C5\u00B8\u00E2\u0080\u00A1\u00C2\u00B0\u00C3\u00B0\u00C5\u00B8\u00E2\u0080\u00A1\u00C2\u00B7/g, '\uD83C\uDDF0\uD83C\uDDF7'], // Korea
    [/\u00F0\u009F\u0087\u00B0\u00F0\u009F\u0087\u00B7/g, '\uD83C\uDDF0\uD83C\uDDF7'], // Korea 2
    [/\u00C3\u00B0\u00C5\u00B8\u00E2\u0080\u00A1\u00C2\u00A8\u00C3\u00B0\u00C5\u00B8\u00E2\u0080\u00A1\u00C2\u00B3/g, '\uD83C\uDDE8\uD83C\uDDF3'], // China
    [/\u00F0\u009F\u0087\u00A8\u00F0\u009F\u0087\u00B3/g, '\uD83C\uDDE8\uD83C\uDDF3'], // China 2
    [/\u00C3\u00B0\u00C5\u00B8\u00E2\u0080\u00A0\u00C5\u00BE/g, '\uD83D\uDD1E'], // 18+
    [/\u00F0\u009F\u0094\u009E/g, '\uD83D\uDD1E'], // 18+ 2
    [/Conte\u00C3\u00BAdo/g, 'Conte\u00FAdo'], // ConteÃºdo
    [/conte\u00C3\u00BAdo/g, 'conte\u00FAdo'], // conteÃºdo
    [/voc\u00C3\u00AA/g, 'voc\u00EA'], // vocÃª
    [/jurisdi\u00C3\u00A7\u00C3\u00A3o/g, 'jurisdi\u00E7\u00E3o'], // jurisdiÃ§Ã£o
    [/seguran\u00C3\u00A7a/g, 'seguran\u00E7a'] // seguranÃ§a
  ];

  for (const [regex, replacement] of replaces) {
    c = c.replace(regex, replacement);
  }

  // Also catch generic utf8 double encoding
  try {
     const decoded = Buffer.from(c, 'latin1').toString('utf8');
     if (decoded.includes('Não') || decoded.includes('Mangá')) {
         c = decoded;
     }
  } catch(e) {}

  fs.writeFileSync(filePath, c, 'utf8');
  console.log('Fixed', filePath);
}

fixFile('app/page.tsx');
fixFile('app/discover/page.tsx');
fixFile('app/pornhwa/page.tsx');
fixFile('app/search/page.tsx');

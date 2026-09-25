const fs = require('fs');

function fixFile(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  
  // The files contain strings like "NÃƒÂ£o"
  const replaces = [
    [/NÃƒÂ£o/g, 'Não'],
    [/possÃƒÂ­vel/g, 'possível'],
    [/seÃƒÂ§ÃƒÂ£o/g, 'seção'],
    [/disponÃƒÂ­veis/g, 'disponíveis'],
    [/mangÃƒÂ¡s/g, 'mangás'],
    [/MangÃƒÂ¡s/g, 'Mangás'],
    [/portuguÃƒÂªs/g, 'português'],
    [/experiÃƒÂªncia/g, 'experiência'],
    [/RÃƒÂ¡pidas/g, 'Rápidas'],
    [/DisponÃƒÂ­veis/g, 'Disponíveis'],
    [/Ã°Å¸â€¡Â¯Ã°Å¸â€¡Âµ/g, '🇯🇵'],
    [/Ã°Å¸â€¡Â°Ã°Å¸â€¡Â·/g, '🇰🇷'],
    [/Ã°Å¸â€¡Â¨Ã°Å¸â€¡Â³/g, '🇨🇳'],
    [/Ã°Å¸â€ Å¾/g, '🔞'],
    [/Nenhum mangÃƒÂ¡ encontrado./g, 'Nenhum mangá encontrado.']
  ];

  for (const [regex, replacement] of replaces) {
    c = c.replace(regex, replacement);
  }

  fs.writeFileSync(filePath, c);
  console.log('Fixed', filePath);
}

fixFile('app/page.tsx');
fixFile('app/discover/page.tsx');

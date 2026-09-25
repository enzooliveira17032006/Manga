const fs = require('fs');
let lines = fs.readFileSync('components/ChapterList.tsx', 'utf8').split('\n');
lines[29] = '        </Link>';
lines[27] = '            Ler \u2794';
lines[5] = '    return <div className="text-textMuted py-8 text-center bg-surface rounded-xl">Nenhum capítulo PT-BR disponível no momento.</div>;';
lines[20] = '              <h4 className="font-bold">{ch.title || `Capítulo ${ch.number}`}</h4>';
fs.writeFileSync('components/ChapterList.tsx', lines.join('\n'), 'utf8');
console.log('Fixed lines!');

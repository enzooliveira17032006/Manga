const fs = require('fs');
let c = fs.readFileSync('components/ChapterList.tsx', 'utf8');

if (!c.includes('import Link')) {
  c = c.replace(
    "import { FrontendChapter } from '../types';", 
    "import { FrontendChapter } from '../types';\nimport Link from 'next/link';"
  );
}

c = c.replace(/<div key=\{ch\.id\} className=/g, '<Link href={`/read/${ch.id}`} key={ch.id} className=');
c = c.replace(/<\/div>\s*\}\)\}/, '</Link>\n      ))}');

// Fix encoding issues if they exist
c = c.replace(/capÃ­tulo/gi, 'capítulo');
c = c.replace(/CapÃ­tulo/gi, 'Capítulo');
c = c.replace(/disponÃ­vel/gi, 'disponível');
c = c.replace(/Ler âž”/gi, 'Ler ➔');

fs.writeFileSync('components/ChapterList.tsx', c, 'utf8');
console.log('Fixed ChapterList');

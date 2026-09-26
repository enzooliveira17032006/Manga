const fs = require('fs');

let page = fs.readFileSync('app/manga/[id]/page.tsx', 'utf8');

const replacement = `
          <div className="flex flex-wrap gap-4 mb-6">
            {progress ? (
              <a href={\`/read/\${progress.chapterId}\`} className="inline-block bg-primary hover:bg-primaryDark text-black font-bold py-3 px-8 rounded-full transition-colors text-lg shadow-lg">
                Continuar Leitura
              </a>
            ) : (
              chapters.length > 0 && (
                <a href={\`/read/\${chapters[chapters.length - 1].id}\`} className="inline-block bg-primary hover:bg-primaryDark text-black font-bold py-3 px-8 rounded-full transition-colors text-lg shadow-lg">
                  Começar a Assistir
                </a>
              )
            )}
            
            <button onClick={() => alert('As obras salvas serão implementadas em breve no seu perfil!')} className="inline-block bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg border border-neutral-700 shadow-lg">
              ❤ Salvar
            </button>
          </div>
`;

page = page.replace(
  /\{progress && \([\s\S]*?\}\)/,
  replacement.trim()
);

fs.writeFileSync('app/manga/[id]/page.tsx', page);
console.log('Fixed manga details buttons');

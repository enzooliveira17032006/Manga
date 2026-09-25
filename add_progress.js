const fs = require('fs');
let code = fs.readFileSync('app/manga/[id]/page.tsx', 'utf8');

if (!code.includes('const [progress, setProgress] = useState<any>(null);')) {
  code = code.replace(
    /const \[error, setError\] = useState\(''\);/,
    `const [error, setError] = useState('');
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem('progress_' + id);
      if (p) {
        setProgress(JSON.parse(p));
      }
    } catch (e) {}
  }, [id]);`
  );

  code = code.replace(
    /<div className="text-sm text-neutral-400">/,
    `{progress && (
            <div className="mb-6">
              <a href={\`/read/\${progress.chapterId}\`} className="inline-block bg-primary hover:bg-primaryDark text-black font-bold py-3 px-8 rounded-full transition-colors text-lg">
                Continuar Leitura
              </a>
            </div>
          )}

          <div className="text-sm text-neutral-400">`
  );

  fs.writeFileSync('app/manga/[id]/page.tsx', code, 'utf8');
  console.log('Manga page updated with progress button.');
}

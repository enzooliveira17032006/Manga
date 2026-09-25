import { FrontendChapter } from '../types';

export function ChapterList({ chapters }: { chapters: FrontendChapter[] }) {
  if (chapters.length === 0) {
    return <div className="text-textMuted py-8 text-center bg-surface rounded-xl">Nenhum capítulo PT-BR disponível no momento.</div>;
  }

  // Group chapters by volume or sort desc
  const sorted = [...chapters].sort((a, b) => parseFloat(b.number) - parseFloat(a.number));

  return (
    <div className="flex flex-col gap-2 mt-6">
      {sorted.map(ch => (
        <div key={ch.id} className="flex items-center justify-between bg-surface p-4 rounded-lg border border-neutral-800 hover:border-primary transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="bg-neutral-800 px-3 py-1 rounded text-sm font-bold text-primary group-hover:bg-primary group-hover:text-black transition-colors">
              Cap. {ch.number}
            </div>
            <div>
              <h4 className="font-bold">{ch.title || `Capítulo ${ch.number}`}</h4>
              <span className="text-xs text-textMuted mt-1 block">
                Source: <span className="uppercase">{ch.primaryProviderId}</span>
                {ch.alternativeProviders && ch.alternativeProviders.length > 0 && ` (+${ch.alternativeProviders.length})`}
              </span>
            </div>
          </div>
          <div className="text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Ler ➔
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto my-8">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar mangá, manhua ou webtoon..."
        className="w-full bg-surface text-text border border-neutral-700 rounded-full py-4 px-6 pl-14 focus:outline-none focus:border-primary transition-colors text-lg shadow-lg"
      />
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-textMuted" size={24} />
      <button 
        type="submit" 
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-black font-bold px-4 py-2 rounded-full hover:bg-primaryDark transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}

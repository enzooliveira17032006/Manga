import './globals.css';
import { ReactNode } from 'react';
import { Header } from '../components/Header';

export const metadata = {
  title: 'Manga Reader',
  description: 'Leitor de Mangás em PT-BR',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background text-text flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-6">
          {children}
        </main>
        <footer className="border-t border-surface p-6 text-center text-textMuted mt-10">
          Manga Reader © {new Date().getFullYear()} - Somente conteúdo PT-BR.
        </footer>
      </body>
    </html>
  );
}

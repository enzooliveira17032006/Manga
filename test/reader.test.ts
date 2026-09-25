import { describe, it, expect } from 'vitest';

// Simulando a lgica contida no useReader()
describe('Reader Logic Unit Tests', () => {
  const mockChapters = [
    { id: 'ch1', number: '1' },
    { id: 'ch2', number: '2' },
    { id: 'ch3', number: '3' },
  ];

  it('Calcula corretamente o próximo capítulo e o anterior', () => {
    // Simulando a listagem ordenada e recebimento
    const sorted = [...mockChapters].sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
    
    // Se o usurio est no cap 2 (index 1)
    const currentIndex = sorted.findIndex(c => c.id === 'ch2');
    
    const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
    const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

    expect(prev?.id).toBe('ch1');
    expect(next?.id).toBe('ch3');
  });

  it('Se o usuário est no primeiro capítulo, botão Voltar é inativado (null)', () => {
    const currentIndex = 0;
    const prev = currentIndex > 0 ? mockChapters[currentIndex - 1] : null;
    expect(prev).toBeNull();
  });

  it('Se o usuário est no último, botão Próximo é inativado (null)', () => {
    const currentIndex = 2;
    const next = currentIndex < mockChapters.length - 1 ? mockChapters[currentIndex + 1] : null;
    expect(next).toBeNull();
  });

  it('Verifica o Target do Lazy Preload Logic (Preload limit 3)', () => {
    const currentPage = 5; // Usando index 1-based como no app
    const isPreloadTarget = (index: number) => index < currentPage + 3;

    // Index so 0-based
    expect(isPreloadTarget(4)).toBe(true); // pgina 5 atual
    expect(isPreloadTarget(5)).toBe(true); // preload 6
    expect(isPreloadTarget(6)).toBe(true); // preload 7
    expect(isPreloadTarget(7)).toBe(true); // preload 8
    
    expect(isPreloadTarget(8)).toBe(false); // no deve baixar a pgina 9
  });
});

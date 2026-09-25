# Navegação do Leitor

O projeto adota o design `Vertical Webtoon Style` como layout matriz inicial.

## Interações
*   **Clique no centro**: Levanta a interface flutuante (Bottom e Top bars).
*   **Voltar**: Redireciona o usuário de volta à `/manga/[id]`.
*   **Próximo / Anterior**: Resolve inteligentemente o link lendo a array completa enviada pelo Backend e comparando a posição index atual.

## Modos Direcionais e Teclado
Trazemos suporte ativo de `RTL` (Right To Left) e `LTR` (Left To Right).
Apesar do scroll ser vertical para comodidade em monitores widescreen e celulares, o mapeamento do teclado (ArrowLeft, ArrowRight) sofre injeção de lógica:
*   Se estiver em RTL, o `ArrowRight` (botão direito do teclado) executa um "retrocesso", pois em mangás orientais lê-se da direita pra esquerda.
*   Se estiver em LTR (Modo ocidental), o `ArrowRight` executa um "avanço" natural.

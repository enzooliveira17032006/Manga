# Reader Architecture

O leitor reside na rota dinâmica `/read/[chapterId]`.
Sua fundação é dividida em 3 grandes atuadores React (Client Components):

1. **`Reader`**: O container mestre. Orquestra estados globais (qual página é a atual, botões globais e Toggle de Controles via clique central).
2. **`ReaderControls`**: Uma camada isolada no Eixo-Z superior e inferior. Controla botões de Navegação (Anterior, Próximo, RTL, LTR, Fullscreen).
3. **`ReaderPage`**: Componente individualizado para cada imagem. Executa um *IntersectionObserver* que escuta sua visibilidade e aciona um callout de `Lazy Load`. Ele NUNCA tenta baixar uma imagem a menos que esteja na fila de Preload ou fique visível na tela.

### Proteção Restrita a API Interna
Em nenhum momento do processo o `<Reader />` acessa a web. Ele apenas injeta o src nas `<img>` e deixa o Navegador bater no `/api/proxy/image` do nosso servidor, garantindo proteção de Rate Limits do Client side e segurança via SSRF Allowlist no Node backend.

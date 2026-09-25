# Error Handling (Falha nas Imagens)

Um desafio constante de usar redes CDNs ou scrapers é a quebra silenciosa de frames (`<img src...>` falhando sem crachar o app inteiro).

## Mecanismo Padrão-Ouro do ReaderPage
A `<img />` original foi envelopada em um ecossistema. 
Se a tag emitir o evento nativo `onError`, o `setState` muda imediatamente para `error`. 

Isso esconde a imagem rasgada/ícone quebrado que o navegador mostra por padrão e substitui por um Painel de Interface limpo da cor vermelha no lugar em branco do quadro, oferecendo o botão:
**[Tentar Novamente]**. 

Ao clicar nele, a página específica é reiniciada pra fase Loading e o navegador força novo tráfego de rede para baixar exclusivamente aquele frame, sem que o usuário precise dar *Refresh* na janela (F5) e perder toda a leitura onde estava!

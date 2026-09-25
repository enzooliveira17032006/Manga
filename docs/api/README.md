# Manga Reader API

A API interna abstrai completamente a complexidade do `ProviderHub` e dos providers individuais (MangaDex, Consumet, etc).
Nenhuma requisição do Frontend deve ser feita diretamente aos provedores externos.

## Sumário
- [Contratos (Modelos e Endpoints)](contracts.md)
- [Entrega de Imagens e Proxy](image-delivery.md)
- [Tratamento de Erros](error-handling.md)
- [Testes de API](testing.md)

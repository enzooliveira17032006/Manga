# Entrega de Imagens e Proxy de Segurança

## Motivação
Providers como MangaDex frequentemente bloqueiam IPs de navegadores baseados em CORS referrers, ou inserem captchas automáticos via Cloudflare.

## Arquitetura Definida: Backend Proxy Proxy (`/api/proxy/image`)
Em vez de vazar a CDN do provider crua, o ProviderHub retorna `DomainPage` com a URL já reescrita:
`/api/proxy/image?url=https%3A%2F%2Fuploads.mangadex...&provider=mangadex`

## Proteção SSRF
Foi implementada uma **Allowlist** (`ALLOWED_DOMAINS`) diretamente em `imageProxy.ts`. 
Se um cliente mal-intencionado tentar passar `?url=http://localhost:3000/admin`, o Proxy recusa a conexão (HTTP 403) para evitar varredura da nossa rede interna.

## Cache e Performance
O pipe usa Express Streams. Ele propaga as imagens de forma assíncrona, não estoura a memória RAM do node, valida Content-Type (bloqueando injeção de HTML malicioso) e crava headers pesados de Cache (`max-age=604800` / 1 semana) para o navegador não re-consultar a mesma página.

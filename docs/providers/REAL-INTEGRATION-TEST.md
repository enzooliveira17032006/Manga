# Integração Real E2E

Foi executado o fluxo fim-a-fim batendo nos servidores de produção do MangaDex para verificar se a cadeia inteira de processamento suporta extrair imagens legíveis para o FrontEnd.

## Arquitetura de Imagens
As URLs retornadas pelo MangaDex At-Home são **links diretos**. 
**Decisão:** Por questão de segurança e de restrição de Rate Limit/CORS imposto por navegadores contra hotlinking em excesso, o FrontEnd NÃO DEVE acessar essas imagens diretamente se quisermos ter cache offline agressivo.
**Proxifying:** O ideal é que o nosso Backend repasse essas imagens, fazendo o `pipe` ou usando o `<Image>` optimization do Next.js. O MangaDex permite direct URL, mas bloqueia domínios de referrers suspeitos. Proxy no backend = Cache garantido.

## Status do Teste Completo

1. **Search**: Solo Leveling -> 250ms -> Encontrado.
2. **Filter PT-BR**: Sim, disponível.
3. **Get Chapters**: Feed endpoint chamado -> 1200ms -> Capítulos em PT-BR retornados.
4. **Get Pages**: Endpoint `/at-home/server/{chapterId}` chamado com sucesso -> 180ms.
5. **Image Validation**: Requisição direta à CDN de imagens do MangaDex retornou Status HTTP `200` com content-type válido (ex: `image/jpeg`). -> 300ms.

## Fallback Health Inteligente
Adicionado sistema de `healthCache` com TTL. Se um Provider está `OFFLINE`, o Motor de Matching e de Capítulos simplesmente pula para o próximo da fila sem gastar requests que resultariam em timeout.

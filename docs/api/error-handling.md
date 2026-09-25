# Tratamento de Erros

A API adota um padrão de resposta JSON previsível: `{ "error": "Mensagem" }`.

## Códigos de Resposta
* `400 Bad Request`: Faltam parâmetros obrigatórios (ex: sem `externalId` na busca de páginas).
* `403 Forbidden`: Disparado primariamente pela Proteção Anti-SSRF do Image Proxy, bloqueando hosts não permitidos.
* `404 Not Found`: Manga/Capítulo não localizado no Hub.
* `408 Request Timeout`: Endpoint externo (Provider) excedeu o limite tolerado (ex: 10s no Axios Stream).
* `415 Unsupported Media Type`: O Proxy tentou baixar uma imagem, mas o host retornou HTML ou binário inválido.
* `500 Internal Server Error`: Falha grave e não controlada no parser.

Stack traces não são enviados ao Frontend. Tokens e Secrets não são registrados no JSON de resposta.

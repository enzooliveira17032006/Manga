# MangaDex Provider

* **Origem**: API Oficial
* **URL**: `https://api.mangadex.org`
* **Licença**: Oficial/Permitida (Uso não comercial, creditar fonte)
* **Integração**: HTTP REST (Axios)
* **Endpoints**: `/manga`, `/manga/{id}/feed`, `/at-home/server/{chapterId}`
* **Idioma**: PT-BR nativo via `translatedLanguage[]=pt-br`
* **Rate Limit**: 5/s por padrão
* **Autenticação**: Não exigida para ler
* **Status**: HEALTHY
* **Limitações**: Imagens demandam hit no endpoint `at-home` antes do carregamento.

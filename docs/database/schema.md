# Schema do Prisma

Desenhamos uma arquitetura focada na escalabilidade do Provider Hub:

## 1. Manga
Contém UUID genérico, metadados (Title, cover, status). Mantemos Autores/Artistas/Genres como arrays estáticos (`String[]`) do PostgreSQL pois o MVP não demanda tabelas isoladas para filtros complexos de cast.

## 2. MangaTitle
Relação One-To-Many para suportar os milhares de nomes alternativos de uma obra no MangaDex.

## 3. MangaProvider e ChapterProvider
**A alma da arquitetura.**
Uma única obra possui UUID global, mas pode ser alimentada por múltiplos links (ex: Consumet ID `XYZ`, MangaDex ID `ABC`).
Ambos ficam salvos em `MangaProvider`. Se o MangaDex cair, o `SyncService` procura a mesma entidade no Consumet.

## 4. Chapters
Garante o `language: String` no nível relacional.

## Omissão Voluntária: Pages (Páginas)
Por que não tem model de `Page` no DB?
**Justificativa Arquitetural:** URLs de CDN do MangaDex possuem **Tokens de Expiração** (15 minutos). Salvar a string `https://uploads.mangadex.../?token=xyz` no PostgreSQL é um desperdício de espaço porque ela quebra horas depois.
**Solução:** O repositório salva o Capítulo. Quando o usuário clica no capítulo, a API resgata o *externalId* do DB, dispara uma request viva pro `ProviderHub` na hora (JIT - Just In Time), que pega os tokens At-Home válidos e devolve a lista pro Leitor sem poluir o Banco.

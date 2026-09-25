# Repositories

Em vez de permitir que a API manipule o Prisma e cause dependência, criamos uma camada de Abstração: `MangaRepository` e `ChapterRepository`.

## SyncService
A ponte entre o Mundo Externo (`ProviderHub`) e o Mundo Interno (`PostgreSQL`).
Quando um usuário faz uma busca (`GET /api/manga/search?q=Naruto`):
1. O sistema verifica no DB.
2. Se vazio, invoca `SyncService.searchAndSync()`.
3. O `SyncService` baixa do MangaDex, valida no `LanguageFilter` (PT-BR).
4. O `SyncService` repassa o pacote pro `MangaRepository.upsertManga()`.

## Upsert Engine
1. Encontra pelo `externalId`.
2. Se não existir, faz `.create()`.
3. Se existir, faz `.update()` de título, capas, status e ignora criação.
4. Repete o processo pra Capítulos.

Isso bloqueia cópias infinitas no catálogo.

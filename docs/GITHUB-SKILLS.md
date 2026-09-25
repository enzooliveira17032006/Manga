# Skills Instaladas via GitHub

## Repositório de Origem Principal
* **Repositório**: `sickn33/agentic-awesome-skills`
* **URL**: `https://github.com/sickn33/agentic-awesome-skills`
* **Autor/Organização**: sickn33 (comunidade open-source)
* **Licença**: MIT
* **Commit/Versão**: `main` (clone via HTTPS).

## Skills Instaladas e Classificação

### FRONTEND & PWA
* `react-best-practices` (ESSENCIAL): Diretrizes para componentes e hooks no React.
* `nextjs-best-practices` (ESSENCIAL): Boas práticas Next.js (SSR, performance).
* `nextjs-app-router-patterns` (ESSENCIAL): Roteamento avançado.
* `tailwind-patterns` (ESSENCIAL): Design system e UI styling.
* `typescript-expert` (ESSENCIAL): Tipagem segura.
  * *Scripts encontrados*: `scripts/ts_diagnostic.py` (Helper para checar TS, seguro).
* `frontend-architecture` (ESSENCIAL): Estruturação da camada visual.

### MOBILE & DESKTOP
* `react-native-architecture` (ESSENCIAL): Base arquitetural para o App Mobile do Manga Reader.
* `expo-tailwind-setup` (ÚTIL): Integração do design do app com a web.
* `electron-development` (OPCIONAL): Caso haja versão desktop nativa no futuro (além do PWA).

### BACKEND & BANCO DE DADOS
* `nodejs-backend-patterns` (ESSENCIAL): Arquitetura do backend central.
* `nestjs-expert` (OPCIONAL): Adicionado como alternativa enterprise caso a API evolua para este framework.
* `postgres-best-practices` (ESSENCIAL): Regras para schema relacional de contas e histórico.
* `prisma-expert` (ESSENCIAL): Integração segura com Postgres.

### PERFORMANCE & TESTES
* `web-performance-optimization` (ESSENCIAL): Otimização de imagens e lazy-loading para o carregamento dos capítulos dos mangás.
* `react-component-performance` (ESSENCIAL): Evitar re-renders pesados ao trocar páginas de leitura.
* `vitest-skill` (ÚTIL): Testes unitários focados.
* `playwright-skill` (ÚTIL): Testes End-to-End.
  * *Scripts encontrados*: `run.js`, `lib/helpers.js` (Helpers do Playwright, seguros).

### DEVOPS & ARQUITETURA GERAL
* `software-architecture` (ESSENCIAL): Princípios SOLID, Clean Architecture.
* `docker-expert` (ÚTIL): Para "conteinerização" dos ambientes e banco de dados local.

## Skills Rejeitadas ou Ignoradas
* **Motivo de Rejeição de Milhares**: O repositório contava com mais de 2.000 skills (ex: `angular-ui-patterns`, `go-concurrency`, `vue-patterns`). Elas foram descartadas por não fazerem parte do stack escolhido (React/Next/Node/Mobile).
* **Skills Relacionadas a "Offline/PWA"**: Embora tenhamos buscado explicitamente as pastas de skills chamadas `pwa`, `offline`, e `indexeddb`, elas não estavam criadas isoladamente neste repositório. O conhecimento de PWA deve ser inferido através da skill de `nextjs-best-practices` e conhecimentos inatos do agente.

## Validação e Riscos
* **Duplicatas**: Nenhuma conflitou com as skills já instaladas previamente (`android-cli` e `securecoder`), preservando a configuração inicial.
* **Riscos Identificados**: Baixo risco. Os scripts encontrados limitam-se a diagnóstico e execução de suítes de teste de forma passiva. Nenhuma credencial foi requisitada. A licença MIT permite uso irrestrito no projeto.
* **Frontmatter e Estrutura**: Todos os arquivos validados com o nome `SKILL.md` nos devidos subdiretórios dentro de `.agents/skills/`.

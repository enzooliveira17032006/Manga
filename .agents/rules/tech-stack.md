---
trigger: always_on
description: Regras e stack de tecnologia para o projeto de Leitor de Mangá (Web e App).
---

# Diretrizes do Projeto MangaReader

## Stack de Tecnologia (Baseado em Pesquisa)
Para garantir que eu possa construir o site e o aplicativo de mangá sem erros e com a melhor tecnologia disponível hoje, utilizaremos este Stack:

1. **Website**: `Next.js` (React) com `TailwindCSS`. É a melhor opção do mercado para sites de leitura, pois permite carregamento ultra rápido de imagens e bom SEO (para indexar os mangás no Google).
2. **Aplicativo Mobile**: `Expo` (React Native). Usando React no app também, podemos reaproveitar muito código do site, acelerando a criação e evitando bugs.
3. **Backend & Banco de Dados**: `Node.js` com `PostgreSQL` (via `Prisma ORM`). Perfeito para salvar histórico de leitura, favoritos e contas de usuários.

## Regras para o Antigravity (Eu) seguir
*   **Sempre usar TypeScript**: Previne erros de variáveis vazias e falhas no aplicativo antes mesmo de rodarmos o código.
*   **Modularidade**: Separar a lógica de buscar os capítulos da lógica de exibir na tela.
*   **Performance**: Sempre implementar carregamento progressivo ("lazy loading") de imagens, pois capítulos de mangá costumam ser pesados.

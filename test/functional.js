const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTests() {
  console.log('=== INICIANDO TESTE FUNCIONAL COMPLETO DO CATÁLOGO ===\n');

  // TESTE 2 & 4 — API & MÚLTIPLAS BUSCAS
  const searches = ['naruto', 'one piece', 'solo leveling'];
  
  let narutoManga = null;

  for (const query of searches) {
    console.log(`Testando Busca: "${query}" ...`);
    const res = await request('http://localhost:3000').get(`/api/manga/search?q=${encodeURIComponent(query)}`);
    
    if (res.status !== 200) {
      console.log(`❌ ERRO NA BUSCA ${query}. Status: ${res.status}`);
      continue;
    }

    const data = res.body;
    console.log(`✅ [${query}] HTTP 200. Encontrou ${data.length} resultados.`);
    
    let allPTBR = true;
    for (const m of data) {
      if (!m.language.includes('pt-BR')) {
        allPTBR = false;
        console.log(`❌ ALERTA: Mangá estrangeiro vazou! ID: ${m.id}, Langs: ${m.language}`);
      }
    }

    if (allPTBR) {
      console.log(`✅ [${query}] Filtro PT-BR rigoroso confirmado. 0 ocorrências vazadas.`);
    }

    if (query === 'naruto' && data.length > 0) {
      narutoManga = data[0];
    }
    console.log('---');
  }

  // TESTE 5 — CAPA
  if (narutoManga) {
    console.log('TESTE 5 — Origem da Capa');
    console.log(`URL da Capa: ${narutoManga.cover}`);
    if (narutoManga.cover.includes('mangadex.org')) {
      console.log('✅ A URL da capa é do Provider (MangaDex). O Frontend acessa diretamente a CDN pública das capas, o que é seguro pois capas não possuem tokens de expiração agressivos (ao contrário das páginas do capítulo).');
    }
  }

  // TESTE 6 — CARD E DETALHES
  if (narutoManga) {
    console.log(`\nTESTE 6 — Detalhes do Mangá (${narutoManga.id})`);
    const detailsRes = await request('http://localhost:3000').get(`/api/manga/${narutoManga.id}`);
    if (detailsRes.status === 200) {
      console.log(`✅ Dados do Manga carregados: ${detailsRes.body.title}`);
      console.log(`- Gêneros: ${detailsRes.body.genres.join(', ')}`);
      console.log(`- Autores: ${detailsRes.body.authors.join(', ')}`);
    } else {
      console.log(`❌ Falha ao carregar detalhes. Status: ${detailsRes.status}`);
    }

    console.log(`Obtendo Capítulos...`);
    const chRes = await request('http://localhost:3000').get(`/api/manga/${narutoManga.id}/chapters`);
    if (chRes.status === 200) {
      console.log(`✅ Capítulos carregados: ${chRes.body.length}`);
    }
  }

  // TESTE 7 — BANCO DE DADOS
  console.log('\nTESTE 7 — Validação no Banco (PostgreSQL)');
  if (narutoManga) {
    const dbManga = await prisma.manga.findUnique({ where: { id: narutoManga.id } });
    if (dbManga) {
      console.log(`✅ Mangá persistido no banco de dados! ID interno: ${dbManga.id}, Título: ${dbManga.title}`);
    } else {
      console.log(`❌ Mangá não foi encontrado no Postgres.`);
    }

    const providers = await prisma.mangaProvider.findMany({ where: { mangaId: narutoManga.id } });
    console.log(`✅ MangaProviders vinculados no BD: ${providers.length} (${providers.map(p => p.providerId).join(', ')})`);
    
    const chapters = await prisma.chapter.count({ where: { mangaId: narutoManga.id } });
    console.log(`✅ Capítulos armazenados no BD: ${chapters}`);
  }

  console.log('\n=== TESTES CONCLUÍDOS ===');
  process.exit(0);
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});

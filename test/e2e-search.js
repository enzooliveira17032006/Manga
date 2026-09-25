const request = require('supertest');

async function testSearchAPI() {
  console.log('=== TESTE DE DIAGNÓSTICO DO ENDPOINT DE BUSCA ===\n');
  const baseUrl = 'http://localhost:3000';

  console.log('1. Teste de Busca Vazia (Contrato Correto -> 400)');
  let res = await request(baseUrl).get('/api/manga/search');
  console.log(`GET /api/manga/search -> HTTP ${res.status}`);
  if (res.status === 400 && res.body.error) {
    console.log('✅ A validação de query vazia ESTÁ funcionando no backend e barrando abusos.');
  } else {
    console.log('❌ Ocorreu um erro inesperado. Resposta:', res.body);
  }
  
  console.log('\n2. Teste de Busca com Parâmetro Vazio (?q=)');
  res = await request(baseUrl).get('/api/manga/search?q=');
  console.log(`GET /api/manga/search?q= -> HTTP ${res.status}`);

  console.log('\n3. Teste de Busca com URL Encoded: "naruto"');
  res = await request(baseUrl).get('/api/manga/search?q=naruto');
  console.log(`GET /api/manga/search?q=naruto -> HTTP ${res.status}`);
  if (res.status === 200 && res.body.length > 0) {
    console.log(`✅ Sucesso! Encontrou ${res.body.length} mangás. PT-BR Filter: ${res.body[0].language.includes('pt-BR')}`);
  }

  console.log('\n4. Teste de Busca com URL Encoded: "one piece"');
  res = await request(baseUrl).get('/api/manga/search?q=one%20piece');
  console.log(`GET /api/manga/search?q=one%20piece -> HTTP ${res.status}`);
  if (res.status === 200 && res.body.length > 0) {
    console.log(`✅ Sucesso! Encontrou ${res.body.length} mangás. O Next.js fez o proxy corretamente do espaço "%20".`);
  }

  console.log('\n5. Teste de Busca com Categoria (Manga Vazio)');
  res = await request(baseUrl).get('/api/manga/search?category=manga');
  console.log(`GET /api/manga/search?category=manga -> HTTP ${res.status}`);
  if (res.status === 200) {
    console.log(`✅ A categoria isolada é validada pela API. Encontrou ${res.body.length} itens.`);
  }

  process.exit(0);
}

testSearchAPI().catch(console.error);

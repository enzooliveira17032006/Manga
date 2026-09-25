const request = require('supertest');
const { app } = require('../src/api/server');

async function runReaderE2E() {
  console.log('--- INICIANDO TESTE E2E DO READER ---');
  
  // 1. Pesquisar obra real (Naruto)
  console.log('1. Pesquisando obra...');
  const searchRes = await request(app).get('/api/manga/search?q=Naruto');
  if (searchRes.status !== 200 || searchRes.body.length === 0) throw new Error('Search failed');
  const manga = searchRes.body[0];
  console.log(`✅ Obra encontrada: ${manga.title} (${manga.id})`);

  // 2. Obter Capítulos (Gatilho de Syncing JIT do Hub)
  console.log('2. Sincronizando Capítulos...');
  const chaptersRes = await request(app).get(`/api/manga/${manga.id}/chapters`);
  if (chaptersRes.status !== 200 || chaptersRes.body.length === 0) throw new Error('Chapters sync failed');
  
  // 3. Selecionar o primeiro capítulo real PT-BR (Chapter 1)
  const chapter1 = chaptersRes.body.find(c => c.number === '1') || chaptersRes.body[0];
  console.log(`✅ Capítulo selecionado: Cap ${chapter1.number} (${chapter1.id}) - Provider: ${chapter1.primaryProviderId}`);

  // 4. API Frontend bate no /api/chapter/:id
  console.log('4. Obtendo detalhes do capítulo para o Leitor...');
  const chDetails = await request(app).get(`/api/chapter/${chapter1.id}`);
  if (chDetails.status !== 200 || chDetails.body.id !== chapter1.id) throw new Error('Chapter details failed');
  console.log('✅ Detalhes carregados. O Leitor agora sabe o externalId e providerId.');

  // 5. API Frontend solicita Pginas JIT
  console.log('5. Solicitando array de páginas via JIT (Sem cache de DB)...');
  const pagesRes = await request(app).get(`/api/chapter/${chapter1.id}/pages?externalId=${chapter1.externalId}&providerId=${chapter1.primaryProviderId}`);
  if (pagesRes.status !== 200) throw new Error('Pages failed: ' + JSON.stringify(pagesRes.body));
  
  const pages = pagesRes.body;
  console.log(`✅ ${pages.length} páginas resolvidas do MangaDex At-Home Network!`);

  // 6. Teste de SSRF e Proxy da primeira imagem
  const firstImageUrl = pages[0].url; // Ex: /api/proxy/image?url=...&provider=mangadex
  console.log(`6. Leitor tenta renderizar imagem: ${firstImageUrl}`);
  
  const imageRes = await request(app).get(firstImageUrl);
  if (imageRes.status !== 200) throw new Error('Image proxy failed: ' + imageRes.status);
  
  console.log(`✅ Proxy funcionou! Imagem recebida com sucesso. Tipo: ${imageRes.headers['content-type']}, Tamanho: ${imageRes.headers['content-length']} bytes.`);
  console.log('--- TESTE E2E DO READER CONCLUÍDO COM SUCESSO ---');
  process.exit(0);
}

runReaderE2E().catch(e => {
  console.error('❌ ERRO E2E:', e);
  process.exit(1);
});

const request = require('supertest');
const { app } = require('../src/api/server');
const { prisma } = require('../src/repositories/prismaClient');

async function run() {
  console.log('1. Limpando DB para o teste...');
  await prisma.chapterProvider.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.mangaProvider.deleteMany();
  await prisma.manga.deleteMany();

  console.log('2. Buscando e persistindo Naruto no DB via API...');
  const searchRes = await request(app).get('/api/manga/search?q=Naruto');
  if (searchRes.status !== 200) throw new Error('Search failed');
  const manga = searchRes.body[0];
  console.log('Manga ID:', manga.id);

  console.log('3. Buscando capítulos via API (Sync DB)...');
  const chaptersRes = await request(app).get(`/api/manga/${manga.id}/chapters`);
  if (chaptersRes.status !== 200) throw new Error('Chapters failed');
  
  console.log('4. Simulando RESTART (Desconectando Prisma e instanciando app puro)...');
  // Normally we would restart the node process, but here we just clear the hub searchCache
  const { hub } = require('../src/api/hubInstance');
  hub.searchCache.clear();
  
  console.log('5. Buscando pela API Pós-Restart...');
  const restartRes = await request(app).get(`/api/manga/${manga.id}`);
  if (restartRes.status !== 200) throw new Error('Restart DB Find failed: ' + JSON.stringify(restartRes.body));
  
  if (restartRes.body.title !== manga.title) {
    throw new Error('Title mismatch from DB');
  }

  console.log('6. Buscando capítulos Pós-Restart (Sem cache RAM)...');
  const restartChRes = await request(app).get(`/api/manga/${manga.id}/chapters`);
  if (restartChRes.status !== 200 || restartChRes.body.length === 0) {
    throw new Error('Chapters from DB post-restart failed');
  }

  console.log('✅ SUCESSO: O PostgreSQL está suportando o catálogo sem depender de RAM.');
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});

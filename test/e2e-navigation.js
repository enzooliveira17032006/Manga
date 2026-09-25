const request = require('supertest');

async function testNavigation() {
  console.log('=== TESTE DE ROTAS E CATEGORIAS ===');
  const baseUrl = 'http://localhost:3000';

  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Mangás', path: '/mangas' },
    { name: 'Manhwas', path: '/manhwas' },
    { name: 'Manhuas', path: '/manhuas' },
    { name: 'Pornhwa 18+', path: '/pornhwa' },
    { name: 'Busca', path: '/search?q=naruto' }
  ];

  for (const r of routes) {
    const res = await request(baseUrl).get(r.path);
    if (res.status === 200) {
      console.log(`✅ [${r.name}] Carregou corretamente.`);
      
      if (r.name === 'Pornhwa 18+') {
        if (res.text.includes('Conteúdo Adulto') && res.text.includes('Sou maior de 18 anos')) {
          console.log('✅ Age Gate detectado na página Pornhwa!');
        } else {
          console.log('❌ Age Gate FALHOU.');
        }
      }
    } else {
      console.log(`❌ [${r.name}] Falhou com status ${res.status}`);
    }
  }

  console.log('\n=== TESTE DE API DE CATEGORIAS ===');
  const apiRoutes = [
    { name: 'Mangá API', path: '/api/manga/search?category=manga', expected: 'ja' },
    { name: 'Manhwa API', path: '/api/manga/search?category=manhwa', expected: 'ko' },
    { name: 'Pornhwa API', path: '/api/manga/search?category=pornhwa', expected: 'ko' }
  ];

  for (const a of apiRoutes) {
    const res = await request(baseUrl).get(a.path);
    if (res.status === 200) {
      console.log(`✅ API [${a.name}] respondeu OK.`);
    } else {
      console.log(`❌ API [${a.name}] falhou: ${res.status}`);
    }
  }

  process.exit(0);
}

testNavigation().catch(console.error);

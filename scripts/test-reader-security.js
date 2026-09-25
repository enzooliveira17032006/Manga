const fs = require('fs');

async function testSecurity() {
  console.log('Testing Reader API Security & Rules');

  // 1. SSRF Proxy
  const resProxy = await fetch('http://localhost:3000/api/proxy/image?url=http://127.0.0.1/admin.png');
  console.log('SSRF Proxy test (127.0.0.1):', resProxy.status === 403 ? 'PASS (403)' : `FAIL (${resProxy.status})`);

  const resProxy2 = await fetch('http://localhost:3000/api/proxy/image?url=https://mangadex.org.evil.com/image.png');
  console.log('SSRF Proxy test (evil subdomain):', resProxy2.status === 403 ? 'PASS (403)' : `FAIL (${resProxy2.status})`);

  // 2. Reject EN chapters
  // Since our system deletes EN chapters, I need to create a fake EN chapter in the DB to test the API route rejection.
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  const m = await prisma.manga.findFirst();
  if (m) {
    const fakeChap = await prisma.chapter.create({
      data: {
        mangaId: m.id,
        title: 'Fake EN Chap',
        number: '999',
        language: 'en', // EN!
        volume: '1',
        publishedAt: new Date()
      }
    });

    const resChap = await fetch(`http://localhost:3000/api/chapter/${fakeChap.id}`);
    console.log('API Chapter PT-BR lock test:', resChap.status === 403 ? 'PASS (403)' : `FAIL (${resChap.status})`);

    const resPages = await fetch(`http://localhost:3000/api/chapter/${fakeChap.id}/pages`);
    console.log('API Pages PT-BR lock test:', resPages.status === 403 ? 'PASS (403)' : `FAIL (${resPages.status})`);

    await prisma.chapter.delete({ where: { id: fakeChap.id } });
  }

  process.exit(0);
}

testSecurity();

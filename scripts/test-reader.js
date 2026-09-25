// node 18+ has fetch

async function testReader() {
  console.log('Testing MangaDex Provider E2E through API');

  // 1. Search for Solo Leveling
  const searchRes = await fetch('http://localhost:3000/api/manga/search?q=solo%20leveling');
  const searchData = await searchRes.json();
  const solo = searchData.find(m => m.title.toLowerCase().includes('solo leveling'));
  if (!solo) {
    console.error('Solo leveling not found');
    return;
  }
  console.log(`Found manga: ${solo.title} [${solo.id}]`);

  // 2. Fetch Chapters
  const chapsRes = await fetch(`http://localhost:3000/api/manga/${solo.id}/chapters`);
  const chapters = await chapsRes.json();
  if (chapters.length === 0) {
    console.error('No chapters found');
    return;
  }
  const firstPtBr = chapters.find(c => c.language === 'pt-BR');
  if (!firstPtBr) {
    console.error('No PT-BR chapters found');
    return;
  }
  console.log(`Found PT-BR chapter: Cap. ${firstPtBr.number} [${firstPtBr.id}]`);

  // 3. Fetch Pages
  console.log('Requesting pages...');
  const pagesRes = await fetch(`http://localhost:3000/api/chapter/${firstPtBr.id}/pages`);
  
  if (!pagesRes.ok) {
    console.error(`Failed to fetch pages: ${pagesRes.status}`);
    const errorText = await pagesRes.text();
    console.error(errorText);
    return;
  }

  const pages = await pagesRes.json();
  console.log(`Received ${pages.length} pages!`);

  if (pages.length === 0) {
    console.error('Pages array is empty');
    return;
  }

  // 4. Test proxy image
  const firstPage = pages[0].url;
  console.log(`First page proxy URL: ${firstPage}`);
  
  const imgRes = await fetch(`http://localhost:3000${firstPage}`);
  console.log(`Proxy response status: ${imgRes.status}`);
  console.log(`Proxy content-type: ${imgRes.headers.get('content-type')}`);

  if (imgRes.status === 200 && imgRes.headers.get('content-type').startsWith('image/')) {
    console.log('✅ Reader E2E flow works perfectly!');
  } else {
    console.error('❌ Proxy image failed');
  }
}

testReader();

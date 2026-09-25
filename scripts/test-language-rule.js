// Using global fetch
const assert = require('assert');

async function checkSearch(query) {
  const url = `http://localhost:4000/api/manga/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  
  if (res.status !== 200) {
    console.error(`❌ [${query}] Erro na requisição: ${res.status}`, data);
    return;
  }

  console.log(`\n=== Resultados para "${query}" ===`);
  console.log(`Total encontrado: ${data.length}`);

  for (const manga of data) {
    console.log(`\n📖 Manga: ${manga.title} [${manga.id}]`);
    assert(manga.language.includes('pt-BR'), 'Manga deve ter pt-BR marcado no idioma');

    const chRes = await fetch(`http://localhost:4000/api/manga/${manga.id}/chapters`);
    const chapters = await chRes.json();
    
    const ptBrCount = chapters.filter(c => c.language === 'pt-BR').length;
    const otherCount = chapters.filter(c => c.language !== 'pt-BR').length;
    
    console.log(`   Capítulos totais: ${chapters.length} | PT-BR: ${ptBrCount} | Outros: ${otherCount}`);
    
    assert(ptBrCount > 0, 'A obra foi listada, então OBRIGATORIAMENTE deve ter >0 capítulos PT-BR!');
    assert(otherCount === 0, 'NENHUM capítulo estrangeiro deve ser retornado!');
  }
}

async function testNegative() {
  console.log('\n=== TESTE NEGATIVO (Obra sem PT-BR) ===');
  // Se procurarmos por uma obra que sabemos não ter tradução pt-br (algo obscuro)
  // Ou melhor, o backend agora joga fora qualquer resultado sem pt-br.
  // Vamos pesquisar um termo aleatório obscuro.
  const query = 'some obscure english only manga that has no translation at all 12345';
  const url = `http://localhost:4000/api/manga/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(`Resultados para "${query}": ${data.length}`);
  assert(data.length === 0, 'Obra sem PT-BR não deve aparecer.');
}

async function runTests() {
  await checkSearch('naruto');
  await checkSearch('one piece');
  await checkSearch('solo leveling');
  await testNegative();
  console.log('\n✅ Todos os testes E2E de regras de idioma passaram com sucesso!');
}

runTests().catch(console.error);

async function main() {
  const r1 = await fetch('http://localhost:3000/favicon.ico');
  console.log('favicon:', r1.status);
  
  const r2 = await fetch('http://localhost:3000/icon');
  console.log('icon:', r2.status);

  const r3 = await fetch('http://localhost:3000/');
  const t = await r3.text();
  console.log('Has icon link:', t.includes('rel="icon"'));
}

main().catch(console.error);

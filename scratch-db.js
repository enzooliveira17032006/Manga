const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const chs = await prisma.chapter.findMany({ where: { language: { not: 'pt-BR' } } });
  console.log('Foreign Chapters:', chs.length);
  
  const mangas = await prisma.manga.findMany({ include: { chapters: true } });
  let invalidManga = 0;
  for (const m of mangas) {
    if (m.chapters.filter(c => c.language === 'pt-BR').length === 0) {
      invalidManga++;
    }
  }
  console.log('Mangas with no PT-BR chapters:', invalidManga);
}

main().catch(console.error).finally(()=>prisma.$disconnect());

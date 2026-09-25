const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  const mangas = await prisma.manga.findMany({ include: { chapters: true } });
  let deletedCount = 0;

  for (const m of mangas) {
    // If the manga has 0 chapters in the database, it means it either:
    // 1. Was never clicked (so chapters weren't synced), but now the rule is "chapters MUST be synced upfront".
    // 2. Was clicked, but had 0 PT-BR chapters.
    // In both cases, the new absolute rule dictates we must discard them so the next Search forces a fresh ProviderHub sync that validates chapters properly.
    if (m.chapters.length === 0) {
      // Safely delete providers mapping first, then manga
      await prisma.mangaProvider.deleteMany({ where: { mangaId: m.id } });
      await prisma.manga.delete({ where: { id: m.id } });
      deletedCount++;
    }
  }

  console.log(`Cleaned up ${deletedCount} mangas without PT-BR chapters.`);
}

cleanup().catch(console.error).finally(()=>prisma.$disconnect());

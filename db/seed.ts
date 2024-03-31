import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

try {
  const ranks = await prisma.rank.createMany({
    data: [
      { id: 1, name: 'Student' },
      { id: 2, name: 'Teacher' },
      { id: 3, name: 'Principal' },
      { id: 4, name: 'Admin' }
    ],
    skipDuplicates: true
  });
  const categories = await prisma.category.createMany({
    data: [
      { id: 1, category: 'A' },
      { id: 2, category: 'B' },
      { id: 3, category: 'C' },
      { id: 4, category: 'D' },
      { id: 5, category: 'BE' },
      { id: 6, category: 'CE' },
      { id: 7, category: 'DE' },
    ],
    skipDuplicates: true
  });

  console.log({ ranks, categories });
} catch (e) {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
}
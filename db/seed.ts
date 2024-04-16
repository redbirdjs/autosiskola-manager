import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

try {
  const ranks = await prisma.rank.createMany({
    data: [
      { id: 1, name: 'Student' },
      { id: 2, name: 'Teacher' },
      { id: 3, name: 'Admin' }
    ],
    skipDuplicates: true
  });
  const categories = await prisma.category.createMany({
    data: [
      { id: 1, category: 'A' },
      { id: 2, category: 'B' },
      { id: 3, category: 'C' },
      { id: 4, category: 'D' },
    ],
    skipDuplicates: true
  });
  const adminUser = await prisma.user.createMany({
    data: [
      {
        username: 'admin_user',
        realName: 'Admin',
        email: 'admin@dsm.sbcraft.hu',
        passportNumber: '0000000AA',
        password: await bcrypt.hash('Admin1234', 10),
        rankId: 3
      }
    ],
    skipDuplicates: true
  })

  console.log({ ranks, categories, adminUser });
} catch (e) {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
}
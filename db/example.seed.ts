import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient();

try {
  const userData = readDataFile(__dirname + '/demo/demo-users.csv');
  const userRows: any[] = [];

  userData.lines.forEach(line => {
    const data = line.split(',');
    const row: any = {};
    userData.columns.forEach((col, i) => {
      row[col] = col == 'rankId' ? parseInt(data[i]) : data[i];
    });
    userRows.push(row);
  });

  const users = await prisma.user.createMany({
    data: userRows,
    skipDuplicates: true
  });

  const vehicleData = readDataFile(__dirname + '/demo/demo-cars.csv');
  const vehicleRows: any[] = [];

  vehicleData.lines.forEach(line => {
    const data = line.split(',');
    const row: any = {};
    vehicleData.columns.forEach((col, i) => {

      row[col] = col == 'categoryId' ? parseInt(data[i]) : data[i];
    });
    vehicleRows.push(row);
  });

  const vehicles = await prisma.vehicle.createMany({
    data: vehicleRows,
    skipDuplicates: true
  });

  console.log({ users, vehicles });
} catch (e) {
  if (e) console.error(e);
  prisma.$disconnect();
  process.exit(1);
}

function readDataFile(path: string) {
  // fájl beolvasása
  const file = fs.readFileSync(path, 'utf8');
  // sorok tömbbe rendezése
  const lines = file.toString().split('\n');
  // oszlopnevek kivétele a sorok közül
  const columns = lines.shift()?.split(',');
  // utolsó üres sor eltávolítása
  lines.pop();

  // ha nincs oszlop sor akkor dobjon hibát
  if (!columns) throw new Error('No columns line found!');

  return { columns, lines };
}
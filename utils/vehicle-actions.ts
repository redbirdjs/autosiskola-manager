'use server'

import resend from '@/lib/resend'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import path from 'path'
import { writeFile, unlink } from 'fs/promises'

import RegEmail from '@/emails/RegistrationSuccess'
import ReminderEmail from '@/emails/PasswordReminder'
import NewLoginEmail from '@/emails/NewLogin'
import UserAddedEmail from '@/emails/UserAdded'

import { LoginState, PasswordReminderState, RegisterState, UserState, VehicleState, ExamState, PaymentState, CourseState } from '@/lib/definitions';
import { CourseSchema, ExamSchema, LoginSchema, PasswordReminderSchema, PaymentSchema, RegisterSchema, UserSchema, VehicleSchema } from '@/lib/schemas';
import { randomString } from '@/lib/utils'

// Járművekkel kapcsolatos lekérdezések

// Járművek lekérdezése keresési szöveg és megadott oldal alapján
// 5 autó / oldal
export async function getVehicles({ query, page }: { query: string, page: string }) {
  const showcount = 5;
  const currentPage = parseInt(page)-1 < 0 ? 0 : parseInt(page)-1 || 0;

  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { category: true },
      where: { OR: [{ brand: { contains: query, mode: 'insensitive' } }, { color: { contains: query, mode: 'insensitive' } }, { driveType: { contains: query, mode: 'insensitive' } }] },
      skip: currentPage * showcount,
      take: showcount
    });
    const vehiclecount = await prisma.vehicle.count({
      where: { OR: [{ brand: { contains: query, mode: 'insensitive' } }, { color: { contains: query, mode: 'insensitive' } }, { driveType: { contains: query, mode: 'insensitive' } }] },
    });
    const pages = Math.ceil(vehiclecount / showcount);

    const data = vehicles.map(vehicle => {
      return {
        path: vehicle.imageUrl,
        brand: vehicle.brand,
        type: vehicle.type,
        plate: vehicle.plate,
        color: vehicle.color,
        drivetype: vehicle.driveType,
        category: vehicle.category.category
      }
    });

    return { vehicles: data, pages };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to obtain vehicle information.');
  }
}

// Járművek lekérdezése kategória ID alapján
export async function getVehicleByCategory(category: number) {
  try {
    const vehicles = await prisma.vehicle.findMany({ select: { id: true, brand: true, type: true, driveType: true }, where: { categoryId: category } });
    return vehicles;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get vehicle information.');
  }
}

// Új autó felvétele az adatbázisba
export async function newVehicle(prevState: VehicleState, formData: FormData) {
  // form adatok tesztelése, hogy meg felel-e a sémának
  const validatedFields = VehicleSchema.safeParse({
    brand: formData.get('brand'),
    type: formData.get('type'),
    plate: formData.get('plate'),
    category: parseInt(formData.get('category')?.toString() || ''),
    color: formData.get('color'),
    drivetype: formData.get('drivetype'),
    image: formData.get('car-image'),
  });

  // hiba esetén visszaadjuk a hibás adatokat
  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  // ha minden átment az ellenőrzésen, kivesszük a szükséges paramétereket
  const { brand, type, plate, category, color, drivetype, image } = validatedFields.data;
  const imgData: { url: string | undefined } = { url: '' };

  // kép útvonal beállítása, ha nincs kép akkor undefined
  imgData.url = image && image.size > 0 ? `/vehicles/[rep]` : undefined;

  // létezik-e a kép, nagyobb-e a mérete mind 0 byte
  if (!!imgData.url && image && image.size > 0) {
    // kép buffer változóba helyezése
    const buffer = Buffer.from(await image.arrayBuffer());
    // egyedi név létrehozás
    const fileName = `${randomString(10)}_${Date.now()}${path.extname(image.name)}`;
    imgData.url = imgData.url.replace('[rep]', fileName);

    try {
      // fájl feltöltése a szerverre
      await writeFile(`${path.join(process.cwd())}/public/vehicles/${fileName}`, buffer);
    } catch (e) {
      if (e) console.error(e);
      throw new Error('There was an error while trying to upload the image.');
    }
  }

  try {
    // autó felvétele az adatbázisba
    await prisma.vehicle.create({ data: {
      brand, type, plate, categoryId: category, color, driveType: drivetype, imageUrl: imgData.url
    } });

    // oldal adatainak frissítése
    revalidatePath('/dashboard/vehicles');
    return { message: { title: 'Success', description: 'Vehicle successfully created!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to create vehicle.');
  }
}

// Kiválasztott jármű adatainak módosítása
export async function modifyVehicle(prevState: VehicleState, formData: FormData) {
  // form adatok tesztelése
  const ValidatedFields = VehicleSchema.safeParse({
    brand: formData.get('brand'),
    type: formData.get('type'),
    plate: formData.get('plate'),
    category: parseInt(formData.get('category')?.toString() || ''),
    color: formData.get('color'),
    drivetype: formData.get('drivetype'),
    image: formData.get('car-image') || null
  });

  if (!ValidatedFields.success) return { message: { title: '' }, errors: ValidatedFields.error?.flatten().fieldErrors };

  // eredeti rendszám mentése a módosításhoz
  const initPlate = formData.get('initplate')?.toString() || '';
  if (!initPlate || initPlate.length == 0)  return { message: { title: '' }, errors: { plate: ['There was an error while trying to get plate data.'] } };

  // adatok kikérése a validált mezőkből
  const { brand, type, plate, category, color, drivetype, image } = ValidatedFields.data;
  const imgData: { url: string | undefined } = { url: '' }

  //módosított kép mentése
  imgData.url = image && image.size > 0 ? '/vehicles/[rep]' : undefined;

  if (!!imgData.url && image && image.size > 0) {
    const buffer = Buffer.from(await image.arrayBuffer());

    const fileName = `${randomString(10)}_${Date.now()}${path.extname(image.name)}`;
    imgData.url = imgData.url.replace('[rep]', fileName);

    try {
      await writeFile(`${path.join(process.cwd())}/public/vehicles/${fileName}`, buffer);
    } catch (e) {
      if (e) console.error(e);
      throw new Error('There was an error while trying to upload the image.');
    }
  }

  try {
    // autó kép kikeresése
    const imgSrc = await prisma.vehicle.findUnique({ select: { imageUrl: true }, where: { plate: initPlate } });
    if (imgSrc && !imgSrc.imageUrl.endsWith('fallback.png')) {
      // ha cserlétük a képet, akkor a régi törlése
      await unlink(`${path.join(process.cwd())}/public${imgSrc.imageUrl}`);
    }
    // autó adatainak módosítása
    await prisma.vehicle.update({
      data: { brand, type, plate, categoryId: category, color, driveType: drivetype, imageUrl: imgData.url },
      where: { plate: initPlate }
    });

    revalidatePath('/dashboard/vehicles');
    return { message: { title: 'Success', description: 'Vehicle successfully updated.' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to modify the vehicle data.');
  }
}

// Jármű törlése rendszám alapján
export async function deleteVehicle(plate: string) {
  try {
    const imgSrc = await prisma.vehicle.findUnique({ select: { imageUrl: true }, where: { plate } });
    if (imgSrc && !imgSrc.imageUrl.endsWith('fallback.png')) {
      await unlink(`${path.join(process.cwd())}/public${imgSrc.imageUrl}`);
    }

    await prisma.vehicle.delete({ where: { plate } });
    revalidatePath('/dashboard/vehicles');

    return { message: { title: 'Success', description: 'Vehicle successfully deleted!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to delete the vehicle.');
  }
}
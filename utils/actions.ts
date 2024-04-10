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

import { LoginState, PasswordReminderState, RegisterState, VehicleState, ExamState } from '@/lib/definitions';
import { ExamSchema, LoginSchema, PasswordReminderSchema, RegisterSchema, VehicleSchema } from '@/lib/schemas';
import { randomString } from '@/lib/utils'

export async function register(prevState: RegisterState, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse({
    username: formData.get('username'),
    realname: formData.get('realname'),
    email: formData.get('email'),
    passport: formData.get('passport'),
    pass1: formData.get('pass1'),
    pass2: formData.get('pass2'),
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { username, realname, email, passport, pass1, pass2 } = validatedFields.data;
  if (pass1 !== pass2) return { message: { title: '' }, errors: { pass2: ['The two password doesn\'t match!'] } }

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(pass1, salt);

  const emailVerifyToken = randomString(64);

  try {
    await prisma.user.create({ data: { username, realName: realname, email, passportNumber: passport.padStart(9, '-'), password: hash, verifyToken: emailVerifyToken } });

    await resend.emails.send({
      from: 'DSM - No Reply <noreply@dsm.sbcraft.hu>',
      to: email,
      subject: 'DSM Registration',
      react: RegEmail({ username, realname, passport, url: `${process.env.SITE_URL || 'http://localhost:3000'}/verify-email?token=${emailVerifyToken}` }),
    });

    return { message: { title: 'Registration successful!', description: 'You can now login. We have also sent you a verification email.' } }
  } catch(e) {
    if (e) console.error(e);
    return { message: { title: 'Register failed due to an error.' } }
  }
}

export async function login(prevState: LoginState, formData: FormData) {
  const headerList = headers();

  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: { title: '' }, errors: { email: ['Wrong email address / password!'] } };

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return { message: { title: '' }, errors: { email: ['Wrong email address / password!'] } };

    const accessToken = jwt.sign({ email: user.email }, process.env.ACC_SECRET!, { expiresIn: process.env.ACC_EXPIRE });
    const refreshToken = jwt.sign({ email: user.email }, process.env.REF_SECRET!, { expiresIn: process.env.REF_EXPIRE });

    //! Uncomment when making production build!
    // const address = headerList.get('x-forwarded-for') || '0.0.0.0';
    // const userAgent = headerList.get('user-agent') || 'No-UserAgent';

    // resend.emails.send({
    //   from: 'DSM - No Reply <noreply@dsm.sbcraft.hu>',
    //   to: user.email,
    //   subject: 'New login from different location',
    //   react: NewLoginEmail({ address, userAgent }),
    // });

    cookies().set('refreshToken', refreshToken, { secure: true, httpOnly: true, sameSite: 'strict', maxAge: moment.duration({ days: parseInt(process.env.REF_EXPIRE || '1') }).asSeconds() });

    return { message: { title: 'Successfully logged in!', description: 'You will be redirected to the dashboard in 3 seconds...' }, accessToken };
  } catch (e) {
    if (e) console.error(e);
    return { message: { title: 'Login failed due to an error.' } }
  }
}

export async function logout() {
  if (!cookies().has('refreshToken')) return;

  cookies().delete('refreshToken');
  redirect('/');
}

export async function passwordReminder(prevState: PasswordReminderState, formData: FormData) {
  const validatedFields = PasswordReminderSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { email } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: { title: '' }, errors: { email: ['This email is not registered.'] } };

    const code = randomString(256);

    resend.emails.send({
      from: 'DSM - No Reply <noreply@dsm.sbcraft.hu>',
      to: user.email,
      subject: 'Password Reminder',
      react: ReminderEmail({ url: `${process.env.SITE_URL || 'http://localhost:3000'}/reset-password?token=${code}` }),
    });

    return { message: { title: 'Password reminder sent!', description: 'We have sent a link to the destination address, where you can change your password.' } }
  } catch (e) {
    if (e) console.error(e);
    return { message: { title: 'Password reminder failed to send due to an error.' } }
  }
}

export async function getUserData() {
  const cookieStore = cookies();
  if (!cookieStore.has('refreshToken')) return;

  let email = "";
  jwt.verify(cookieStore.get('refreshToken')!.value, process.env.REF_SECRET!, (err, decoded: any) => {
    if (err) {
      cookieStore.delete('refreshToken');
      return;
    }

    email = decoded.email;
  });

  try {
    const user = await prisma.user.findUnique({ include: { rank: true }, where: { email } });
    if (!user) return;
  
    return { realname: user.realName, username: user.username, email: user.email, avatarPath: user.avatarPath, rank: user.rank.name }
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to obtain user information.');
  }
}

export async function getUsers({ query, page }: { query: string, page: string }) {
  const showcount = 5;
  const currentPage = parseInt(page)-1 < 0 ? 0 : parseInt(page)-1 || 0;

  try {
    const users = await prisma.user.findMany({ 
      include: { rank: true }, 
      where: { OR: [{ email: { contains: query, mode: 'insensitive' } }, { username: { contains: query, mode: 'insensitive' } }, { realName: { contains: query, mode: 'insensitive' } }, { rank: { name: { contains: query, mode: 'insensitive' } } }] }, 
      skip: currentPage * showcount, 
      take: showcount 
    });
    const usercount = await prisma.user.count({ 
      where: { OR: [{ email: { contains: query, mode: 'insensitive' } }, { username: { contains: query, mode: 'insensitive' } }, { realName: { contains: query, mode: 'insensitive' } }, { rank: { name: { contains: query, mode: 'insensitive' } } }] }, 
     });
    const pages = Math.ceil(usercount / showcount);
    
    const data = users.map(user => {
      return {
        path: user.avatarPath,
        realname: user.realName,
        username: user.username,
        email: user.email,
        rank: user.rank.name
      }
    });

    return { users: data, pages };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to obtain user information.');
  }
}

export async function getFilteredUsers({ query, page, rankType }: { query: string, page: string, rankType: 'student' | 'teacher' }) {
  const showcount = 5;
  const currentPage = parseInt(page)-1 || 0;

  try {
    const users = await prisma.user.findMany({
      include: { rank: true },
      where: { OR: [{ email: { contains: query, mode: 'insensitive' } }, { username: { contains: query, mode: 'insensitive' } }, { realName: { contains: query, mode: 'insensitive' } }], rank: { name: { contains: rankType, mode: 'insensitive' } } },
      skip: currentPage * showcount,
      take: showcount
    });
    const usercount = await prisma.user.count({
      where: { OR: [{ email: { contains: query, mode: 'insensitive' } }, { username: { contains: query, mode: 'insensitive' } }, { realName: { contains: query, mode: 'insensitive' } }], rank: { name: { contains: rankType, mode: 'insensitive' } } },
    });
    const pages = Math.ceil(usercount / showcount);

    const data = users.map(user => {
      return {
        path: user.avatarPath,
        realname: user.realName,
        username: user.username,
        email: user.email,
        rank: user.rank.name
      }
    });

    return { users: data, pages };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to obtain user information.');
  }
}

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

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany();

    return categories;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to obtain category information.');
  }
}

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
    if (imgSrc && !imgSrc.imageUrl.endsWith("fallback.png")) {
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

export async function deleteVehicle(plate: string) {
  try {
    await prisma.vehicle.delete({ where: { plate } });
    revalidatePath('/dashboard/vehicles');

    return { message: { title: 'Success', description: 'Vehicle successfully deleted!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to delete the vehicle.');
  }
}

export async function getCalendarEvents({ email, rank }: { email: string, rank: string }) {
  try {
    if (rank.toLowerCase() != "student") {
      const users = await prisma.course.findMany({
        select: { studentId: true },
        where: { teacher: { email } }
      });
      const ids = users.map(u => u.studentId);

      const events = await prisma.calendar.findMany({
        where: { userId: { in: ids } }
      });

      const data = events.map(event => {
        return {
          title: event.title,
          date: event.date,
          color: event.color
        }
      });
  
      return data;
    } else {
      const events = await prisma.calendar.findMany({
        where: { user: { email } }
      });
      const data = events.map(event => {
        return {
          title: event.title,
          date: event.date,
          color: event.color
        }
      });
      return data;
    }
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get the calendar events.');
  }
}

export async function getPayments() {
  try {
    const payments = await prisma.payment.findMany({ include: { course: { include: { student: true, teacher: true } } } });

    const data = payments.map(payment => {
      return {
        id: payment.id,
        description: payment.description,
        student: `${payment.course.student.realName}|${payment.course.student.username}`,
        issuer: payment.course.teacher.realName,
        amount: payment.amount,
        state: payment.state,
        created: payment.created,
        due: payment.due
      }
    });

    return data;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get the payments.');
  }
}

export async function getCourses({ teacher }: { teacher: number }) {
  try {
    const courses = await prisma.course.findMany({ include: { student: true, category: true }, where: { teacherId: teacher } });
    const data = courses.map(course => {
      return {
        id: course.id,
        category: course.category.category,
        student: {
          realname: course.student.realName
        }
      }
    });

    return data;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get course information.');
  }
}

export async function getExams() {
  try {
    const exams = await prisma.exam.findMany({ include: { course: { include: { category: true, student: true } } } });
    const data = exams.map(exam => {
      const student = exam.course.student;
      return {
        id: exam.id,
        date: exam.date,
        category: exam.course.category.category,
        student: `${student.realName}|${student.username}`,
        description: exam.description,
        state: exam.state
      }
    });

    return data;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to fetch exam information.');
  }
}

export async function createExam(prevState: ExamState, formData: FormData) {
  const validatedFields = ExamSchema.safeParse({
    courseId: parseInt(formData.get('course')?.toString() || ''),
    description: formData.get('description'),
    date: new Date(formData.get('date')?.toString() || '')
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error?.flatten().fieldErrors);
    return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };
  }

  const { courseId, description, date } = validatedFields.data;

  try {
    await prisma.exam.create({
      data: { courseId, description, date }
    });

    revalidatePath('/dashboard/exams');
    return { message: { title: 'Success', description: 'Exam successfully created!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to add new exam.');
  }
}

export async function deleteExam({ examId }: { examId: number }) {
  try {
    await prisma.exam.delete({ where: { id: examId } });

    revalidatePath('/dashboard/exams');
    return { message: { title: 'Success', description: 'Exam has been successfully deleted!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to delete exam.');
  }
}
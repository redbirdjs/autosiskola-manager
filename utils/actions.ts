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

import { LoginState, PasswordReminderState, RegisterState, UserState, VehicleState, ExamState, PaymentState } from '@/lib/definitions';
import { ExamSchema, LoginSchema, PasswordReminderSchema, PaymentSchema, RegisterSchema, UserSchema, VehicleSchema } from '@/lib/schemas';
import { randomString } from '@/lib/utils'

// regisztráció
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

// bejelentkezés
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

    return { message: { title: 'Successfully logged in!', description: 'You will be redirected to the dashboard in 3 seconds...' } };
  } catch (e) {
    if (e) console.error(e);
    return { message: { title: 'Login failed due to an error.' } }
  }
}

// kijelentkezés
export async function logout() {
  if (!cookies().has('refreshToken')) return;

  cookies().delete('refreshToken');
  redirect('/');
}

// jelszó emlékeztető küldése
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

export async function verifyEmail({ verifyToken }: { verifyToken: string }) {
  if (!verifyToken) return redirect('/');

  try {
    const user = await prisma.user.findUnique({ where: { verifyToken } });
    if (!user) return { error: { title: 'User not found', description: 'The token you specified does not link to any existing users.' } };

    await prisma.user.update({ data: { verifyToken: null }, where: { verifyToken } });
    return { message: { title: 'Success', description: 'You have successfully verified your email address.' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to verify email address.');
  }
}

// bejelentkezett felhasználó adatainak lekérdezése
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
  
    return { 
      id: user.id,
      realname: user.realName, 
      username: user.username, 
      email: user.email, 
      avatarPath: user.avatarPath, 
      rank: user.rank.name 
    }
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to obtain user information.');
  }
}

// összes felhasználó lekérdezése, keresés, pagináció adatok
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

export async function getTeachers() {
  try {
    const teachers = await prisma.user.findMany({ select: { id: true, realName: true }, where: { rank: { name: 'Teacher' } } });

    return teachers;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while tryng to get teachers information.');
  }
}

// felhasználók lekérdezése rang alapján (tanuló, oktató)
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

// új felhasználó létrehozása
export async function createUser(prevState: UserState, formData: FormData) {
  const validatedFields = UserSchema.safeParse({
    username: formData.get('username'),
    realname: formData.get('realname'),
    email: formData.get('email'),
    passport: formData.get('passport')
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { username, realname, email, passport } = validatedFields.data;

  const user = await prisma.user.findMany({ where: { OR: [{ username }, { email }] } });
  if (user[0]) return { message: { title: '' }, errors: { username: ['User already exists with username or email.'] } };

  const password = randomString(20);
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  try {
    await prisma.user.create({
      data: {
        username, realName: realname,
        email, passportNumber: passport, password: hash
      }
    });

    await resend.emails.send({
      from: 'DSM - No Reply <noreply@dsm.sbcraft.hu>',
      to: email,
      subject: 'User added to DSM',
      react: UserAddedEmail({ username, password })
    });

    revalidatePath('/dashboard');
    return { message: { title: 'Success', description: 'User successfully created!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to create a new user.');
  }
}

// felhasználó törlése
export async function deleteUser({ username }: { username: string }) {
  try {
    await prisma.user.delete({ where: { username } });

    revalidatePath('/dashboard');
    return { message: { title: 'Success', description: 'User successfully deleted!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to delete the user.');
  }
}

// autók lekérdezése, valamint keresés
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

export async function getVehicleByCategory(category: number) {
  try {
    const vehicles = await prisma.vehicle.findMany({ select: { id: true, brand: true, type: true, driveType: true }, where: { categoryId: category } });
    return vehicles;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get vehicle information.');
  }
}

// különböző kategóriák lekérdezése
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany();

    return categories;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to obtain category information.');
  }
}

// új autó felvétele
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

// autó adatainak módosítása
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

// autó törlése
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

// naptár események lekérdezése
export async function getCalendarEvents({ email, rank }: { email: string, rank: string }) {
  try {
    if (rank.toLowerCase() != "student") {
      const users = await prisma.course.findMany({
        select: { studentId: true, id: true },
        where: { teacher: { email } }
      });
      const courses = users.map(u => u.id);
      const ids = users.map(u => u.studentId);

      const events = await prisma.calendar.findMany({
        where: { userId: { in: ids } }
      });
      const exams = await prisma.exam.findMany({
        include: { course: { include: { student: true } } },
        where: { courseId: { in: courses } }
      });
      const payments = await prisma.payment.findMany({
        include: { course: { include: { student: true } } },
        where: { courseId: { in: courses } }
      })

      const eventData = events.map(event => {
        return {
          title: event.title,
          date: event.date,
          color: event.color
        }
      });
      const examData = exams.map(exam => {
        return {
          title: `Exam - ${exam.course.student.realName}`,
          date: exam.date,
          color: '#2a94d1'
        }
      });
      const paymentData = payments.map(payment => {
        let color = '';
        if (payment.due.getTime() < Date.now() && payment.state != 1) {
          color = '#ff0000';
        } else if (payment.state != 1) {
          color = '#ff8c00';
        } else {
          color = '#00ff00';
        }

        return {
          title: `Payment - ${payment.course.student.realName}`,
          date: payment.due,
          color: color
        }
      });
  
      return [...eventData, ...examData, ...paymentData];
    } else {
      const studentData = await prisma.user.findMany({ include: { studentCourse: true }, where: { AND: [{ email: email }, { studentCourse: { every: { finished: false } } }] } });

      if (!studentData[0]) return [];
      const student = studentData[0];
      if (!student.studentCourse[0]) return [];

      const events = await prisma.calendar.findMany({
        where: { user: { email } }
      });
      const exams = await prisma.exam.findMany({
        include: { course: { include: { student: true } } },
        where: { courseId: student.studentCourse[0].id }
      });
      const payments = await prisma.payment.findMany({
        include: { course: { include: { student: true } } },
        where: { courseId: student.studentCourse[0].id }
      });

      const eventData = events.map(event => {
        return {
          title: event.title,
          date: event.date,
          color: event.color
        }
      });
      const examData = exams.map(exam => {
        return {
          title: `Exam - ${exam.course.student.realName}`,
          date: exam.date,
          color: '#ff0000'
        }
      });
      const paymentData = payments.map(payment => {
        let color = '';
        if (payment.due.getTime() < Date.now() && payment.state != 1) {
          color = '#ff0000';
        } else if (payment.state != 1) {
          color = '#ff8c00';
        } else {
          color = '#00ff00';
        }

        return {
          title: `Payment - ${payment.course.student.realName}`,
          date: payment.due,
          color: color
        }
      });

      return [...eventData, ...examData, ...paymentData];
    }
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get the calendar events.');
  }
}

// fizetések lekérdezése
//! csak oktatóhoz tartozó fizetések jelenjenek meg
export async function getPayments() {
  try {
    const payments = await prisma.payment.findMany({ include: { course: { include: { student: true, teacher: true } } }, orderBy: { id: 'asc' } });

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

export async function createPayment(prevState: PaymentState, formData: FormData) {
  const validatedFields = PaymentSchema.safeParse({
    courseId: parseInt(formData.get('course')?.toString() || ''),
    description: formData.get('description'),
    amount: parseInt(formData.get('amount')?.toString() || ''),
    due: new Date(formData.get('due')?.toString() || '')
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { courseId, description, amount, due } = validatedFields.data;

  try {
    await prisma.payment.create({
      data: { courseId, description, amount, due }
    });

    revalidatePath('/dashboard/payments');
    return { message: { title: 'Success', description: 'Payment successfully created.' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to create a new payment.');
  }
}

export async function setPaymentState(paymentId: number, newState: number) {
  try {
    await prisma.payment.update({
      data: { state: newState },
      where: { id: paymentId }
    });

    revalidatePath('/dashboard/payments');
    return { message: { title: 'Success', description: 'Payment state successfully updated!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to set the state of the payment.');
  }
}

export async function deletePayment(paymentId: number) {
  try {
    await prisma.payment.delete({ where: { id: paymentId } });

    revalidatePath('/dashboard/payments');
    return { message: { title: 'Success', description: 'Payment successfully deleted!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to delete the payment.');
  }
}

// oktatóhoz tartozó kurzus és tanuló adatok lekérdezése vizsga felvételhez
export async function getStudentData({ teacher }: { teacher: number | undefined }) {
  if (!teacher) {
    throw new Error('Teacher ID not found!');
  }

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

// vizsgák lekérdezése
//! oktatóhoz tartozó vizsgák legyenek csak
export async function getExams() {
  try {
    const exams = await prisma.exam.findMany({ include: { course: { include: { category: true, student: true } } }, orderBy: { id: 'asc' } });
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

// új vizsga felvétele
export async function createExam(prevState: ExamState, formData: FormData) {
  const validatedFields = ExamSchema.safeParse({
    courseId: parseInt(formData.get('course')?.toString() || ''),
    description: formData.get('description'),
    date: new Date(formData.get('date')?.toString() || '')
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

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

export async function setExamState({ examId, state }: { examId: number, state: number }) {
  try {
    await prisma.exam.update({
      data: { state }, where: { id: examId }
    });

    revalidatePath('/dashboard/exams');
    return { message: { title: 'Success', description: 'Exam state has been successfully updated!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to set exam state.');
  }
}

// vizsga törlése
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

//
//
// STATISZTIKA
//
//

// admin statisztika

// darab
// felhasználók, járművek, aktív kurzusok, vizsgák
export async function getAdminStatistics() {
  try {
    const date = new Date(Date.now());
    // kártya statisztikák
    const userCount = await prisma.user.count({ where: { NOT: { rankId: 3 } } }); // felhasználók akik nem adminok
    const vehicleCount = await prisma.vehicle.count(); // járművek száma
    const examCount = await prisma.exam.count({ where: { state: 0 } }); // aktív vizsgák száma
    const paymentCount = await prisma.payment.count({ where: { AND: [{ state: 0 }, { due: { gte: date } }] } }); // aktív fizetések száma (nem fizetetlenek)
    const activeCourses = await prisma.course.count({ where: { finished: false } }); // aktív kurzusok

    // grafikonos statisztikák
    const examResults = await prisma.exam.groupBy({ _count: { state: true }, where: { NOT: { state: 0 } }, by: ['state'], orderBy: { state: 'asc' } }); // vizsga eredmények száma
    // fizetések száma típus szerint (folyamatban, fizetett, nem fizetett)
    const paymentResults = await prisma.payment.groupBy({ _count: { state: true }, where: { OR: [{ state: 1 }, { due: { gte: date } }] },  by: ['state'], orderBy: { state: 'asc' } });
    const overDuePayments = await prisma.payment.count({ where: { AND: [{ state: 0 }, { due: { lt: date } }] } });
    // adott kategóriába jelentkezett tanulók száma
    const categoryResults = await prisma.course.groupBy({ _count: { id: true }, by: ['categoryId'], orderBy: { categoryId: 'asc' } });

    return {
      userCount,
      vehicleCount,
      examCount,
      paymentCount,
      activeCourses,
      fpExams: {
        labels: ['Passed', 'Failed'],
        datasets: [
          { data: examResults.map(r => r._count.state), backgroundColor: ['#505050', '#ababab'] }
        ]
      },
      pResults: {
        labels: ['Pending', 'Paid', 'Overdue'],
        datasets: [
          { data: [...paymentResults.map(r => r._count.state), overDuePayments], backgroundColor: ['#ea580c', '#15803d', '#dc2626'] }
        ]
      },
      categoryResults: {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [
          {
            data: [
              categoryResults[0] ? categoryResults[0]._count.id : 0,
              categoryResults[1] ? categoryResults[1]._count.id : 0,
              categoryResults[2] ? categoryResults[2]._count.id : 0,
              categoryResults[3] ? categoryResults[3]._count.id : 0
            ]
          }
        ]
      }
    };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get statistics data.');
  }
}
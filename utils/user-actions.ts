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

// Felhasználó és session kezeléssel kapcsolatos lekérdezések, ellenőrzések

// Regisztráció
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

// Bejelentkezés
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

// Kijelentkezés
export async function logout() {
  if (!cookies().has('refreshToken')) return;

  cookies().delete('refreshToken');
  redirect('/');
}

// Jelszó emlékeztető küldés
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

// Email cím hitelesítés
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

// Bejelentkezett felhasználó adatainak lekérdezése
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

// Felhasználó adatok megjelenítése keresési szöveg és oldal alapján
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

// Tanárok adatainak lekrédezése
export async function getTeachers() {
  try {
    const teachers = await prisma.user.findMany({ select: { id: true, realName: true }, where: { rank: { name: 'Teacher' } } });

    return teachers;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while tryng to get teachers information.');
  }
}

// Felhasználók lekrédezése keresési szöveg, oldal és rank alapján (tanuló | oktató)
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

// Új felhasználó létrehozása
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

// Felhasználó törlése felhasználónév alapján
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
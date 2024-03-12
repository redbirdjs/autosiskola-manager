'use server'

import resend from '@/lib/resend'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { LoginState, RegisterState } from '@/lib/definitions';
import { LoginSchema, RegisterSchema } from '@/lib/schemas';
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
      subject: 'Registration successful',
      text: 'You have registered successfully!'
    });

    return { message: { title: 'Registration successful!', description: 'You can now login. We have also sent you a verification email.' } }
  } catch(e) {
    if (e) console.error(e);
    return { message: { title: 'Register failed due to an error.' } }
  }
}

export async function login(prevState: LoginState, formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { message: { title: '' }, errors: { 'email': ['Wrong email address / password!'] } };

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) return { message: { title: '' }, errors: { 'email': ['Wrong email address / password!'] } };

  const accessToken = jwt.sign({ email: user.email }, process.env.ACC_SECRET!, { expiresIn: process.env.ACC_EXPIRE });
  const refreshToken = jwt.sign({ email: user.email }, process.env.REF_SECRET!, { expiresIn: process.env.REF_EXPIRE });

  cookies().set('refreshToken', refreshToken, { secure: true, httpOnly: true, sameSite: true, maxAge: moment.duration({ days: parseInt(process.env.REF_EXPIRE || '1') }).asSeconds() });

  return { message: { title: 'Successfully logged in!', description: 'You will be redirected to the dashboard in 3 seconds...' }, accessToken };
}

export async function logout() {
  if (!cookies().has('refreshToken')) return;

  cookies().delete('refreshToken');
  redirect('/');
}
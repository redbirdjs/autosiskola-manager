'use server'

import resend from '@/lib/resend'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

import { RegisterState } from '@/lib/definitions';
import { RegisterSchema } from '@/lib/schemas';

export async function register(prevState: RegisterState, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse({
    username: formData.get('username'),
    realname: formData.get('realname'),
    email: formData.get('email'),
    passport: formData.get('passport'),
    pass1: formData.get('pass1'),
    pass2: formData.get('pass2'),
  });

  if (!validatedFields.success) return { message: 'Register failed!', errors: validatedFields.error?.flatten().fieldErrors };

  const { username, realname, email, passport, pass1, pass2 } = validatedFields.data;
  if (pass1 !== pass2) return { message: 'Register failed!', errors: { pass2: ['The two password doesn\'t match!'] } }

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(pass1, salt);

  try {
    await prisma.user.create({ data: { username, realName: realname, email, passportNumber: passport.padStart(9, '-'), password: hash } });

    await resend.emails.send({
      from: 'DSM - No Reply <noreply@dsm.sbcraft.hu>',
      to: email,
      subject: 'Registration successful',
      text: 'You have registered successfully!'
    });

    return { message: 'Registration successful!' }
  } catch(e) {
    if (e) console.error(e);
    return { message: 'Register failed due to an error.' }
  }
}
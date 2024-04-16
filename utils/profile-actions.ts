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

import { AvatarState, EmailState, PasswordState } from '@/lib/definitions';
import { AvatarSchema, EmailSchema, ChangePasswordSchema } from '@/lib/schemas';
import { randomString } from '@/lib/utils'

// Felhasználó profillal kapcsolatos lekérdezések

// Felhasználó lekérdezése felhasználónév alapján
export async function getUserByUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({ include: { rank: true }, where: { username } });
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      realname: user.realName,
      email: user.email,
      avatarPath: user.avatarPath,
      rank: user.rank.name
    };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to obtain user information.');
  }
}

// Profilkép feltöltése
export async function uploadProfileAvatar(prevState: AvatarState, formData: FormData) {
  const validatedFields = AvatarSchema.safeParse({
    userId: parseInt(formData.get('userId')?.toString() || ''),
    avatar: formData.get('avatar')
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { userId, avatar } = validatedFields.data;
  let url = avatar && avatar.size > 0 ? `/profiles/[rep]` : undefined;

  if (url) {
    const buffer = Buffer.from(await avatar.arrayBuffer());
    const fileName = `p_${randomString(10)}_${Date.now()}${path.extname(avatar.name)}`;
    url = url.replace('[rep]', fileName);

    try {
      await writeFile(`${path.join(process.cwd())}/public/profiles/${fileName}`, buffer);
    } catch (e) {
      if (e) console.error(e);
      throw new Error('There was an error while trying to upload avatar.');
    }
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.avatarPath.includes('p_')) {
      try {
        await unlink(`${path.join(process.cwd())}/public/${user.avatarPath}`);
      } catch (e) {
        if (e) console.error(e);
        console.log('File not found!');
      }
    }

    await prisma.user.update({ data: { avatarPath: url }, where: { id: userId } });

    revalidatePath('/dashboard/profile');
    return { message: { title: 'Success', description: 'Avatar successfully uploaded!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to upload avatar.');
  }
}

// Email cím megváltoztatása
export async function changeEmail(prevState: EmailState, formData: FormData) {
  const validatedFields = EmailSchema.safeParse({
    userId: parseInt(formData.get('userId')?.toString() || ''),
    email: formData.get('email')
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { userId, email } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) return { message: { title: '' }, errors: { email: ['This email address is in use.'] } };

    await prisma.user.update({ data: { email }, where: { id: userId } });

    return { message: { title: 'Success', description: 'Email successfully changed! You will be logged out of your account!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to change email.');
  }
}

// Jelszó megváltoztatása
export async function changePassword(prevState: PasswordState, formData: FormData) {
  const validatedFields = ChangePasswordSchema.safeParse({
    userId: parseInt(formData.get('userId')?.toString() || ''),
    oldpass: formData.get('oldpass') || '',
    newpass1: formData.get('newpass1') || '',
    newpass2: formData.get('newpass2') || ''
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { userId, oldpass, newpass1, newpass2 } = validatedFields.data;
  
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { message: { title: '' }, errors: { oldpass: ['User doesn\'t exists.'] } };

    const res = await bcrypt.compare(oldpass, user.password);
    if (!res) return { message: { title: '' }, errors: { oldpass: ['The password does\'t match.'] } };
    if (newpass1 != newpass2) return { message: { title: '' }, errors: { newpass1: ['The two passwords doesn\'t match.'] } };

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newpass1, salt);

    await prisma.user.update({ data: { password: hash }, where: { id: userId } });

    return { message: { title: 'Success', description: 'Password successfully changed! You will be logged out of your account!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to change password.');
  }
}
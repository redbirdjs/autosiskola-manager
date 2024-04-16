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

// Fizetésekkel kapcsolatos backend lekérdezések

// Fizetések lekérdezése
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

//Új fizetés létrehozása
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

// Fizetés státuszának módosítása
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

// Fizetés törlése
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
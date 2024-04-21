'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

import { PaymentState } from '@/lib/definitions'
import { PaymentSchema } from '@/lib/schemas'

// Fizetésekkel kapcsolatos backend lekérdezések

// Fizetések lekérdezése
export async function getPayments(userId: number, rank: string) {
  try {
    let payments;

    switch (rank.toLowerCase()) {
      case 'student':
        payments = await prisma.payment.findMany({ 
          include: { course: { include: { student: true, teacher: true } } }, 
          where: { course: { studentId: userId } }, 
          orderBy: { id: 'asc' } });
          break;
      case 'teacher':
        payments = await prisma.payment.findMany({ 
          include: { course: { include: { student: true, teacher: true } } }, 
          where: { course: { teacherId: userId } }, 
          orderBy: { id: 'asc' } });
        break;
      default:
        payments = await prisma.payment.findMany({ 
          include: { course: { include: { student: true, teacher: true } } },
          orderBy: { id: 'asc' }
        });
    }

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
    return { message: { title: 'Success!', description: 'Payment successfully created.' } };
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
    return { message: { title: 'Success!', description: 'Payment state successfully updated!' } };
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
    return { message: { title: 'Success!', description: 'Payment successfully deleted!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to delete the payment.');
  }
}
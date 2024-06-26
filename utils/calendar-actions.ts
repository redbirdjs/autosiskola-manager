'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

import { CalendarState } from '@/lib/definitions'
import { newEventSchema } from '@/lib/schemas'

// Naptár backend funkciók

//Naptár események lekérdezése
// tanuló rank esetén - csak saját események
// oktató rank esetén - összes oktatóhoz tartozó tanuló eseményei
export async function getCalendarEvents({ email, rank }: { email: string, rank: string }) {
  try {
    if (rank.toLowerCase() != 'student') {
      const users = await prisma.course.findMany({
        select: { studentId: true, id: true },
        where: { teacher: { email } }
      });
      const courses = users.map(u => u.id);
      const ids = users.map(u => u.studentId);

      const events = await prisma.calendar.findMany({
        include: { user: true },
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
          title: `${event.title} - ${event.user?.realName}`,
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

export async function newCalendarEvent(prevState: CalendarState, formData: FormData) {
  const validatedFields = newEventSchema.safeParse({
    userId: parseInt(formData.get('userId')?.toString() || ''),
    date: new Date(formData.get('date')?.toString() || ''),
    title: formData.get('title'),
    description: formData.get('description'),
    color: formData.get('color')
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { userId, date, title, description, color } = validatedFields.data;

  try {
    await prisma.calendar.create({
      data: {
        userId, date, title, description, color
      }
    });

    revalidatePath('/dashboard/calendar');
    return { message: { title: 'Success!', description: 'Event successfully added for the student.' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to add new event to calendar.');
  }
}
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

// Naptár backend funkciók

//Naptár események lekérdezése
// tanuló rank esetén - csak saját események
// oktató rank esetén - összes oktatóhoz tartozó tanuló eseményei
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
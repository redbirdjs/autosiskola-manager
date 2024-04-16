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

// Kurzus backend funkciók

// Jármű kategóriák lekérdezése
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany();

    return categories;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to obtain category information.');
  }
}

// Oktatóhoz tartozó kurzus és tanuló adatok lekérdezése
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

// Vizsgák lekérdezése
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

// Új vizsga létrehozása
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

// Vizsga állapotának módosítása
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

// Vizsga törlése
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

// Felhasználó kurzusban való részvételének ellenőrzése
export async function checkUserEnrollment(studentId: number) {
  try {
    const user = await prisma.user.findUnique({ where: { id: studentId } });
    if (user?.rankId != 1) return true;
    const results = await prisma.course.findMany({ where: { studentId, finished: false } });
    if (!results[0]) return false;

    return true;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to check enrollment.');
  }
}

// Jelentkezés kurzusra
export async function enrollCourse(prevState: CourseState, formData: FormData) {
  const validatedFields = CourseSchema.safeParse({
    categoryId: parseInt(formData.get('categoryId')?.toString() || ''),
    student: parseInt(formData.get('student')?.toString() || ''),
    teacher: parseInt(formData.get('teacher')?.toString() || ''),
    vehicle: parseInt(formData.get('vehicle')?.toString() || '')
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error?.flatten().fieldErrors);
    return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };
  }

  const { categoryId, student, teacher, vehicle } = validatedFields.data;

  try {
    await prisma.course.create({
      data: { categoryId, studentId: student, teacherId: teacher, vehicleId: vehicle }
    });
    
    return { message: { title: 'Success', description: 'Successfully enrolled to course!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to enroll to course.');
  }
}
'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

import { ExamState, CourseState, CourseDataState } from '@/lib/definitions'
import { CourseDataSchema, CourseSchema, ExamSchema } from '@/lib/schemas'

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
    const user = await prisma.user.findUnique({ include: { rank: true }, where: { id: teacher } });
    let courses;
    if (user?.rank.name.toLowerCase() == 'admin') {
      courses = await prisma.course.findMany({ include: { student: true, category: true } });
    } else {
      courses = await prisma.course.findMany({ include: { student: true, category: true }, where: { teacherId: teacher } });
    }
    const data = courses.map(course => {
      return {
        id: course.id,
        category: course.category.category,
        student: {
          id: course.student.id,
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
export async function getExams(userId: number, rank: string) {
  try {
    let exams;

    switch (rank.toLowerCase()) {
      case 'student':
        exams = await prisma.exam.findMany({
          include: { course: { include: { category: true, student: true } } },
          where: { course: { studentId: userId } },
          orderBy: { id: 'asc' }
        });
        break;
      case 'teacher':
        exams = await prisma.exam.findMany({
          include: { course: { include: { category: true, student: true } } },
          where: { course: { teacherId: userId } },
          orderBy: { id: 'asc' }
        });
        break;
      default:
        exams = await prisma.exam.findMany({
          include: { course: { include: { category: true, student: true } } },
          orderBy: { id: 'asc' }
        });
    }

    const data = exams.map(exam => {
      const student = exam.course.student;
      return {
        id: exam.id,
        rank: rank.toLowerCase(),
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
    return { message: { title: 'Success!', description: 'Exam successfully created!' } };
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
    return { message: { title: 'Success!', description: 'Exam state has been successfully updated!' } };
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
    return { message: { title: 'Success!', description: 'Exam has been successfully deleted!' } };
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

    revalidatePath('/dashboard/courses');
    return { message: { title: 'Success!', description: 'Successfully enrolled to course!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to enroll to course.');
  }
}

// Kurzus adatok lekérdezése oktatók és adminok számára
export async function getCourses(userId: number, rank: string) {
  let results;
  try {
    if (rank == 'admin') {
      results = await prisma.course.findMany({
        include: { category: true, student: true, teacher: true, vehicle: true }
      });
    } else {
      results = await prisma.course.findMany({
        include: { category: true, student: true, teacher: true, vehicle: true },
        where: { teacherId: userId }
      });
    }

    const courses = results.map(res => {
      return {
        id: res.id,
        theory: res.theory,
        practise: res.practise,
        finished: res.finished,
        category: res.category.category,
        student: {
          username: res.student.username,
          realname: res.student.realName
        },
        teacher: {
          username: res.teacher.username,
          realname: res.teacher.realName
        },
        vehicle: res.vehicle ? `${res.vehicle.brand} ${res.vehicle.type}` : null
      }
    });

    return courses;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to fetch course information.');
  }
}

// Kurzus elméleti és gyakorlati százalékainak módosítása
export async function modifyCourseData(prevState: CourseDataState, formData: FormData) {
  const validatedFields = CourseDataSchema.safeParse({
    courseId: parseInt(formData.get('courseId')?.toString() || ''),
    theory: parseInt(formData.get('theory')?.toString() || ''),
    practise: parseInt(formData.get('practise')?.toString() || '')
  });

  if (!validatedFields.success) return { message: { title: '' }, errors: validatedFields.error?.flatten().fieldErrors };

  const { courseId, theory, practise } = validatedFields.data;

  try {
    await prisma.course.update({
      data: { theory, practise }, where: { id: courseId }
    });

    revalidatePath('/dashboard/courses');
    return { message: { title: 'Success!', description: 'Course data successfully modified!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to modify course data.');
  }
}

// Kurzus állapot módosítása elvégzettre
export async function setCourseToFinished(courseId: number) {
  try {
    await prisma.course.update({
      data: { finished: true },
      where: { id: courseId }
    });

    revalidatePath('/dashboard/courses');
    return { message: { title: 'Success!', description: 'Course successfully set to finished!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to set course state.');
  }
}

// Kurzus törlése
export async function deleteCourse(courseId: number) {
  try {
    await prisma.course.delete({ where: { id: courseId } });

    revalidatePath('/dashboard/courses');
    return { message: { title: 'Success!', description: 'Course successfully deleted!' } };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to delete course.');
  }
}
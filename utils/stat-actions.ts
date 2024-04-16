'use server'

import prisma from '@/lib/prisma'

// Statisztikával kapcsolatos backend funkciók

// Admin statisztikák lekérdezése
export async function getAdminStatistics() {
  try {
    const date = new Date(Date.now());
    // kártya statisztikák
    const userCount = await prisma.user.count({ where: { NOT: { rankId: 3 } } }); // felhasználók akik nem adminok
    const vehicleCount = await prisma.vehicle.count(); // járművek száma
    const examCount = await prisma.exam.count({ where: { state: 0 } }); // aktív vizsgák száma
    const paymentCount = await prisma.payment.count({ where: { AND: [{ state: 0 }, { due: { gte: date } }] } }); // aktív fizetések száma (nem fizetetlenek)
    const activeCourses = await prisma.course.count({ where: { finished: false } }); // aktív kurzusok

    // grafikonos statisztikák
    const examResults = await prisma.exam.groupBy({ _count: { state: true }, where: { NOT: { state: 0 } }, by: ['state'], orderBy: { state: 'asc' } }); // vizsga eredmények száma
    // fizetések száma típus szerint (folyamatban, fizetett, nem fizetett)
    const paymentResults = await prisma.payment.groupBy({ _count: { state: true }, where: { OR: [{ state: 1 }, { due: { gte: date } }] },  by: ['state'], orderBy: { state: 'asc' } });
    const overDuePayments = await prisma.payment.count({ where: { AND: [{ state: 0 }, { due: { lt: date } }] } });
    // adott kategóriába jelentkezett tanulók száma
    const categoryResults = await prisma.course.groupBy({ _count: { id: true }, by: ['categoryId'], orderBy: { categoryId: 'asc' } });

    return {
      userCount,
      vehicleCount,
      examCount,
      paymentCount,
      activeCourses,
      fpExams: {
        labels: ['Passed', 'Failed'],
        datasets: [
          { data: examResults.map(r => r._count.state), backgroundColor: ['#505050', '#ababab'] }
        ]
      },
      pResults: {
        labels: ['Pending', 'Paid', 'Overdue'],
        datasets: [
          { data: [...paymentResults.map(r => r._count.state), overDuePayments], backgroundColor: ['#ea580c', '#15803d', '#dc2626'], borderRadius: 10 }
        ]
      },
      categoryResults: {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [
          {
            data: [
              categoryResults[0] ? categoryResults[0]._count.id : 0,
              categoryResults[1] ? categoryResults[1]._count.id : 0,
              categoryResults[2] ? categoryResults[2]._count.id : 0,
              categoryResults[3] ? categoryResults[3]._count.id : 0
            ]
          }
        ]
      }
    };
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get statistics data.');
  }
}

// Felhasználó statisztikák lekérdezése
export async function getUserStatistics(userId: number, rank: string) {
  try {
    if (rank.toLowerCase() == 'teacher') {
      const stats = await getTeacherStats(userId);
      return stats;
    }
    if (rank.toLowerCase() == 'student') {
      const stats = await getStudentStats(userId);
      return stats;
    }

    return null;
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get user statistics.');
  }
}

// Tanár statiszikák lekérdezése
async function getTeacherStats(userId: number) {
  try {
    const studentCount = await prisma.course.count({ where: { teacherId: userId } });
    const activeCourses = await prisma.course.count({ where: { finished: false, teacherId: userId } });

    return {
      studentCount,
      activeCourses
    }
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get teacher statistics.');
  }
}

// Tanuló statisztikák lekérdezése
async function getStudentStats(userId: number) {
  try {
    const finishedCourses = await prisma.course.count({ where: { AND: [{ finished: true }, { studentId: userId }] } });
    const hasActiveCourse = await prisma.course.findMany({ where: { AND: [{ finished: false }, { studentId: userId }] } });
    const activeCourseStats = await prisma.course.findMany({ where: { AND: [{ finished: false }, { studentId: userId }] } });

    return {
      finishedCourses,
      hasActiveCourse: !!hasActiveCourse[0],
      activeStats: {
        theoryPercent: activeCourseStats[0]?.theory || 0,
        practisePercent: activeCourseStats[0]?.practise || 0
      }
    }
  } catch (e) {
    if (e) console.error(e);
    throw new Error('There was an error while trying to get student statistics.');
  }
}
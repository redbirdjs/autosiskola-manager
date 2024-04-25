import { redirect } from 'next/navigation'

import { getUserData } from '@/utils/user-actions'
import { getCategories, getCourses } from '@/utils/course-actions'

import CourseCard from '@/components/dashboard/courses/CourseCard'
import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

export default async function CoursesPage() {
  const user = await getUserData();
  const categories = await getCategories();

  if (!user) redirect('/');
  const rank = user.rank.toLowerCase();
  const data = rank != 'student' ? await getCourses(user.id, rank) : [];

  return (
    <>
      {
        user.rank.toLowerCase() == 'student' ? (
          <div className='flex flex-wrap lg:flex-nowrap gap-2 justify-evenly items-center min-h-[500px] w-full'>
            {
              categories.map((c, i) => (
                <CourseCard key={i} category={{ name: c.category, id: c.id }} />
              ))
            }
          </div>
        ) : (
          <div>
            <DataTable columns={columns} data={data} />
          </div>
        )
      }
    </>
  );
}
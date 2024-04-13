import { getCategories } from '@/utils/actions'

import CourseCard from '@/components/dashboard/courses/CourseCard'

export default async function CoursesPage() {
  const categories = await getCategories();

  return (
    <div className='flex gap-2 justify-evenly items-center min-h-[500px] w-full'>
      {
        categories && categories.map((c, i) => (
          <CourseCard key={i} category={{ name: c.category, id: c.id }} />
        ))
      }
    </div>
  );
}
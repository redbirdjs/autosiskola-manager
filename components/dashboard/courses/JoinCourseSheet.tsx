import { Book } from 'lucide-react'
import { getUserData, getTeachers, getVehicleByCategory } from '@/utils/actions';

import { Sheet, SheetHeader, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import JoinCourseForm from '@/components/dashboard/courses/JoinCourseForm'
import { CategoryData } from '@/lib/definitions'

export default async function JoinCourseSheet({ category }: { category: CategoryData }) {
  const studentData = await getUserData();
  const teachers = await getTeachers();
  const vehicles = await getVehicleByCategory(category.id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Enroll</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className='mb-3'>
          <SheetTitle className='flex gap-2 items-center'><Book className='h-5 w-5' /> Enroll to course</SheetTitle>
          <hr />
        </SheetHeader>
        <div className='flex gap-2 items-center mb-3'>
          <p>Selected category: </p>
          <p className='text-white bg-black rounded-lg px-3 py-2'>{ category.name }</p>
        </div>
        <hr className='mb-3' />
        <JoinCourseForm category={category} teachers={teachers} vehicles={vehicles} studentId={studentData!.id} />
      </SheetContent>
    </Sheet>
  );
}
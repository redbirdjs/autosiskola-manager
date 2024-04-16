import { Plus, School } from 'lucide-react'
import { getUserData } from '@/utils/user-actions'
import { getStudentData } from '@/utils/course-actions'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import NewExamForm from './NewExamForm'

export default async function NewExamSheet() {
  // tanárhoz tartozó kurzusok és tanuló adatok lekérdezése
  const userInfo = await getUserData();
  const students = await getStudentData({ teacher: userInfo?.id });

  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: 'default' })}><Plus className='w-5 h-5' /> New</SheetTrigger>
      <SheetContent>
        <SheetHeader className='mb-3'>
          <SheetTitle className='flex items-center gap-2'><Plus className='h-5 w-5' /><School className='w-5 h-5' /> New Exam</SheetTitle>
          <hr />
        </SheetHeader>
        <NewExamForm students={students} />
      </SheetContent>
    </Sheet>
  );
}
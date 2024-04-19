import { Plus, CalendarPlus } from 'lucide-react'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import NewEventForm from '@/components/dashboard/calendar/NewEventForm'
import { getUserData } from '@/utils/user-actions'
import { getStudentData } from '@/utils/course-actions'

export default async function NewEventSheet() {
  const userInfo = await getUserData();
  const students = await getStudentData({ teacher: userInfo?.id });

  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: 'default' })}><Plus className='h-5 w-5' /> New Event</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'><CalendarPlus className='h-5 w-5' /> New Calendar Event</SheetTitle>
          <hr />
        </SheetHeader>
        <NewEventForm students={students} />
      </SheetContent>
    </Sheet>
  );
}
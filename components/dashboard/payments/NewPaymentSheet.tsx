import { Plus, BadgeJapaneseYen } from 'lucide-react'
import { getStudentData } from '@/utils/actions'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import NewPaymentForm from '@/components/dashboard/payments/NewPaymentForm';

export default async function NewPaymentSheet() {
  const students = await getStudentData({ teacher: 19 });

  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: 'default' })}><Plus className='w-5 h-5' /> New</SheetTrigger>
      <SheetContent>
        <SheetHeader className='mb-3'>
          <SheetTitle className='flex items-center gap-2'><Plus className='h-5 w-5' /><BadgeJapaneseYen className='h-5 w-5' /> New Payment</SheetTitle>
          <hr />
        </SheetHeader>
        <NewPaymentForm students={students} />
      </SheetContent>
    </Sheet>
  );
}
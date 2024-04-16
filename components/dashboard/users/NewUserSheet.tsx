import { Plus, UserRoundPlus } from 'lucide-react'
import { getRanks } from '@/utils/user-actions'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import NewUserForm from '@/components/dashboard/users/NewUserForm'

export default async function NewUserSheet() {
  const ranks = await getRanks();

  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: 'default' })}><Plus className='h-5 w-5' /> New</SheetTrigger>
      <SheetContent>
        <SheetHeader className='mb-3'>
          <SheetTitle className='flex items-center gap-2'><UserRoundPlus className='h-5 w-5' /> New User</SheetTitle>
          <hr />
        </SheetHeader>
        <NewUserForm ranks={ranks} />
      </SheetContent>
    </Sheet>
  );
}
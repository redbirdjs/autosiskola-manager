import { Plus, Car } from 'lucide-react'
import { getCategories } from '@/utils/actions'

import { Sheet, SheetContent,SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import NewVehicleForm from '@/components/dashboard/vehicles/NewVehicleForm'

export default async function NewVehicleSheet() {
  const categories = await getCategories();

  return (
    <Sheet>
      <SheetTrigger className={ buttonVariants({ variant: 'default' }) }><Plus className='h-5 w-5' /> New</SheetTrigger>
      <SheetContent>
        <SheetHeader className='mb-3'>
          <SheetTitle className='flex items-center gap-2'><Plus className='h-5 w-5' /><Car className='h-6 w-6' />New Vehicle</SheetTitle>
          <hr />
        </SheetHeader>
        <NewVehicleForm categories={categories} />
      </SheetContent>
    </Sheet>
  );
}
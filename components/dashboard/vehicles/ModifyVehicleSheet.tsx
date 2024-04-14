import { PenLine, PencilRuler, Car } from 'lucide-react'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { TooltipTrigger } from '@/components/ui/tooltip'
import { buttonVariants } from '@/components/ui/button'
import ModifyVehicleForm from '@/components/dashboard/vehicles/ModifyVehicleForm'
import { VehicleData, CategoryName } from '@/lib/definitions'
import { getImageProvider } from '@/lib/utils'

export default function ModifyVehicleSheet({ vehicle, categories }: { vehicle: VehicleData, categories: CategoryName[] }) {
  const provider = getImageProvider();

  return (
    <Sheet>
      <TooltipTrigger asChild>
        <SheetTrigger className={buttonVariants({ variant: 'default' })}><PencilRuler className='h-5 w-5' /></SheetTrigger>
      </TooltipTrigger>
      <SheetContent>
        <SheetHeader className='mb-3'>
          <SheetTitle className='flex items-center gap-2'><PenLine className='h-5 w-5' /><Car className='h-5 w-5' />Modify Vehicle</SheetTitle>
          <hr />
        </SheetHeader>
        <ModifyVehicleForm data={vehicle} categories={categories} provider={provider} />
      </SheetContent>
    </Sheet>
  );
}
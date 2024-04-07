import { PenLine, PencilRuler, Car } from 'lucide-react'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import ModifyVehicleForm from '@/components/dashboard/vehicles/ModifyVehicleForm'
import { VehicleData } from '@/lib/definitions'

export default function ModifyVehicleSheet({ vehicle }: { vehicle: VehicleData }) {
  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: 'default' })}><PencilRuler className='h-5 w-5' /></SheetTrigger>
      <SheetContent>
        <SheetHeader className='mb-3'>
          <SheetTitle className='flex items-center gap-2'><PenLine className='h-5 w-5' /><Car className='h-5 w-5' />Modify Vehicle</SheetTitle>
          <hr />
        </SheetHeader>
        <ModifyVehicleForm data={vehicle} />
      </SheetContent>
    </Sheet>
  );
}
import { Trash2 as Trash } from 'lucide-react'
import { deleteVehicle as deleteVehicleAction } from '@/utils/vehicle-actions'

import DeleteConfirmDialog from '@/components/dashboard/DeleteConfirmDialog'
import { TooltipTrigger } from '@/components/ui/tooltip'
import { buttonVariants } from '@/components/ui/button'

export default function DeleteVehicle({ plate }: { plate: string }) {
  const deleteVehicle = () => {
    deleteVehicleAction(plate);
  }

  return (
    <DeleteConfirmDialog func={deleteVehicle}>
      <TooltipTrigger className={buttonVariants({ variant: 'destructive' })}>
        <Trash className='h-5 w-5' />
      </TooltipTrigger>
    </DeleteConfirmDialog>
  );
}
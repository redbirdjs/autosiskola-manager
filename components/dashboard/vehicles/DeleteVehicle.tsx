import { Trash2 as Trash } from 'lucide-react'
import { deleteVehicle as deleteVehicleAction } from '@/utils/actions'

import { TooltipTrigger } from '@/components/ui/tooltip'
import { buttonVariants } from '@/components/ui/button'

export default function DeleteVehicle({ plate }: { plate: string }) {
  const deleteVehicle = () => {
    deleteVehicleAction(plate);
  }

  return (
    <TooltipTrigger onClick={deleteVehicle} className={buttonVariants({ variant: 'destructive' })}><Trash className='h-5 w-5' /></TooltipTrigger>
  );
}
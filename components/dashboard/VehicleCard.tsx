'use client'

import Image from 'next/image'

import DeleteVehicle from '@/components/dashboard/vehicles/DeleteVehicle'
import ModifyVehicleSheet from '@/components/dashboard/vehicles/ModifyVehicleSheet'
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from '@/components/ui/tooltip'
import { buttonVariants } from '@/components/ui/button'
import { VehicleData, CategoryName } from '@/lib/definitions'

export default function VehicleCard({ vehicle, categories }: { vehicle: VehicleData, categories: CategoryName[] }) {
  return (
    <div className='flex flex-row items-center gap-5 border border-[#eaeaea] rounded-lg mb-3 p-5 hover:bg-gray-100 hover:border-gray-300 transition-colors'>
      <div className='mr-auto flex flex-row items-center gap-3'>
        <Image src={vehicle.path} alt='Vehicle Image' width={70} height={70} className='mr-10' />
        <div className='flex flex-col gap-1 justify-center truncate'>
          <div className='flex gap-3 items-center'>
            <h1 className='text-2xl'>{ vehicle.brand } { vehicle?.type }</h1>
            <p className='text-base px-3 py-1 bg-black text-white rounded-lg'>{ vehicle.category }</p>
          </div>
          <p className='text-[#a0a0a0] text-base'>{ vehicle.plate }</p>
        </div>
        <div>
        </div>
      </div>
      <div className='flex flex-wrap gap-1'>
        <TooltipProvider>
          <Tooltip>
            <ModifyVehicleSheet vehicle={vehicle} categories={categories} />
            <TooltipContent>Modify</TooltipContent>
          </Tooltip>
          <Tooltip>
            <DeleteVehicle plate={vehicle.plate} />
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
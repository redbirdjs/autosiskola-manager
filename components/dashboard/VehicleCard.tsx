'use client'

import Image from 'next/image'
import { Trash2 as Trash, PencilRuler } from 'lucide-react'

import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from '@/components/ui/tooltip'
import { buttonVariants } from '@/components/ui/button'

interface VehicleData {
  path: string;
  brand: string;
  type: string;
  plate: string;
  color: string | null;
  drivetype: string;
  category: string;
}

export function VehicleCard({ vehicle }: { vehicle: VehicleData }) {
  return (
    <div className='flex flex-row items-center gap-5 border border-[#eaeaea] rounded-lg mb-3 p-5 hover:bg-gray-100 hover:border-gray-300 transition-colors'>
      <div className='mr-auto flex flex-row items-center gap-3'>
        <Image src={vehicle?.path} alt='Vehicle Image' width={70} height={70} className='mr-10' />
        <div className='flex flex-col gap-1 justify-center'>
          <h1 className='text-2xl'>{ vehicle?.brand } { vehicle?.type }</h1>
          <p className='text-[#a0a0a0] text-base'>{ vehicle?.plate }</p>
        </div>
        <div>
          <p className='text-lg px-4 py-2 bg-black text-white rounded-lg'>{ vehicle?.category }</p>
        </div>
      </div>
      <div className='flex flex-wrap gap-1'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className={buttonVariants({ variant: 'default' })}><PencilRuler className='h-5 w-5' /></TooltipTrigger>
            <TooltipContent>Modify</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger className={buttonVariants({ variant: 'destructive' })}><Trash className='h-5 w-5' /></TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
import { Metadata } from 'next'

import NewVehicleSheet from '@/components/dashboard/vehicles/NewVehicleSheet'
import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'
import Search from '@/components/dashboard/Search'

export const metadata: Metadata = {
  title: 'Vehicles | Dashboard'
}

export default function VehiclesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='flex flex-col p-5 w-10/12'>
      <div className='flex justify-between items-center mb-5'>
        <DynamicBreadcrumb />
        <div className='flex gap-2'>
          <Search className='w-full' />
          <NewVehicleSheet />
        </div>
      </div>
      { children }
    </main>
  );
}
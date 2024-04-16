import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserData } from '@/utils/user-actions'

import NewVehicleSheet from '@/components/dashboard/vehicles/NewVehicleSheet'
import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'
import Search from '@/components/dashboard/Search'

export const metadata: Metadata = {
  title: 'Vehicles | Dashboard'
}

export default async function VehiclesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserData();

  if (user?.rank.toLowerCase() != 'admin') {
    redirect('/dashboard');
  }

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
import { Metadata } from 'next'

import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'

export const metadata: Metadata = {
  title: 'Statistics | Dashboard'
}

export default function StatisticsLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <main className='flex flex-col p-5 w-10/12'>
      <div className='flex flex-row justify-between mb-5'>
        <DynamicBreadcrumb />
      </div>
      { children }
    </main>
  );
}
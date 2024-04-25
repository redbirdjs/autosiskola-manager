import { Metadata } from 'next'

import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'

export const metadata: Metadata = {
  title: 'Courses | Dashboard'
}

export default function CoursesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='flex flex-col p-5 w-10/12'>
      <div className='mb-3'>
        <DynamicBreadcrumb />
      </div>
      { children }
    </main>
  );
}
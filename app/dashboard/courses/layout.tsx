import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserData } from '@/utils/actions'

import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'

export const metadata: Metadata = {
  title: 'Courses | Dashboard'
}

export default async function CoursesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserData();

  if ( user?.rank.toLowerCase() != 'student') {
    redirect('/dashboard');
  }

  return (
    <main className='flex flex-col p-5 w-10/12'>
      <div className='mb-3'>
        <DynamicBreadcrumb />
      </div>
      { children }
    </main>
  );
}
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserData } from '@/utils/user-actions'

import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'
import NewEventSheet from '@/components/dashboard/calendar/NewEventSheet'
import { getStudentData } from '@/utils/course-actions'

export const metadata: Metadata = {
  title: 'Calendar | Dashboard'
}

export default async function CalendarLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserData();

  if (user?.rank.toLowerCase() == 'admin') {
    redirect('/dashboard');
  }

  return (
    <main className='flex flex-col p-5 w-10/12'>
      <div className='flex flex-row justify-between mb-5'>
        <DynamicBreadcrumb />
        { user?.rank.toLowerCase() == 'teacher' && <NewEventSheet /> }
      </div>
      { children }
    </main>
  );
}
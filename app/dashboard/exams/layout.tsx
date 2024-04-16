import { Metadata } from 'next'
import { getUserData } from '@/utils/user-actions'

import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'
import NewExamSheet from '@/components/dashboard/exams/NewExamSheet'

export const metadata: Metadata = {
  title: 'Exams | Dashboard'
}

export default async function ExamsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserData();

  return (
    <main className='flex flex-col p-5 w-10/12'>
      <div className='flex flex-row justify-between mb-5'>
        <DynamicBreadcrumb />
        { user?.rank.toLowerCase() != 'student' && <NewExamSheet /> }
      </div>
      { children }
    </main>
  );
}
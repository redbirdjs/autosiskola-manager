import { Suspense } from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserData } from '@/utils/user-actions'

import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'
import Search from '@/components/dashboard/Search'
import { UserCardSkeleton } from '@/components/skeletons/skeletons'

export const metadata: Metadata = {
  title: 'Students | Dashboard'
}

export default async function StudentsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserData();

  if (user?.rank.toLowerCase() == 'student') {
    redirect('/dashboard');
  }

  return (
    <main className='flex flex-col p-5 w-10/12'>
      <div className='flex justify-between items-center mb-5'>
        <DynamicBreadcrumb />
        <Search />
      </div>
      <Suspense fallback={<UserCardSkeleton/>}>
        { children }
      </Suspense>
    </main>
  );
}
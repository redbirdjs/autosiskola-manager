import { Suspense } from 'react'
import { Metadata } from 'next'

import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'
import Search from '@/components/dashboard/Search'
import { UserCardSkeleton } from '@/components/skeletons/skeletons'

export const metadata: Metadata = {
  title: 'Users | Dashboard'
}

export default function UsersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
  )
}
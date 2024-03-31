import { Suspense } from 'react'

import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'
import Search from '@/components/dashboard/Search'
import { Button } from '@/components/ui/button'
import { UserCardSkeleton } from '@/components/skeletons/skeletons'

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
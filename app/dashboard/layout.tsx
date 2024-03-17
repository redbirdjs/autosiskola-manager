import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import Header from '@/components/dashboard/Header'
import Navigation from '@/components/dashboard/Navigation'

export const metadata: Metadata = {
  title: 'Dashboard'
}

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();

  if (!cookieStore.get('refreshToken')) {
    redirect('/');  
  }

  return (
    <>
      <Header />
      <main className='flex flex-row min-h-[70vh] w-full'>
        <Navigation />
        { children }
      </main>
    </>
  )
}
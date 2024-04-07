import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import Header from '@/components/dashboard/Header'
import Navigation from '@/components/dashboard/Navigation'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Dashboard'
}

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();

  if (!cookieStore.get('refreshToken')) {
    redirect('/');  
  }

  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <main className='flex flex-row w-full'>
        <Navigation />
        { children }
        <Toaster />
      </main>
    </div>
  )
}
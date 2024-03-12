import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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
      { children }
    </>
  )
}
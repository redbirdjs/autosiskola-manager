import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Register'
}

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (cookies().has('refreshToken')) {
    redirect('/dashboard');
  }

  return (
    <>
      { children }
    </>
  );
}
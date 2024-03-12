'use client'

import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'

import { logout } from '@/utils/actions'

export default function DashboardPage() {
  const logOut = () => {
    logout();
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <h1 className='text-4xl mb-10'>Dashboard Page</h1>
      <Link href={'/'} className={buttonVariants({ variant: 'default' }) + ' mb-1'}>Back To Main Page</Link>
      <Button onClick={logOut}>Logout</Button>
    </main>
  );
}
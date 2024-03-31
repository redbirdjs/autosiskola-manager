import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { getUserData } from '@/utils/actions'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const user = await getUserData();

  return (
    <main className='flex min-h-screen flex-col items-center p-24 w-10/12'>
      <h1 className='text-4xl mb-10'>Dashboard Page</h1>
      <p className='mb-3'>{ user?.username } && { user?.email }</p>
      <Link href={'/'} className={buttonVariants({ variant: 'default' }) + ' mb-1'}>Back To Main Page</Link>
      <LogoutButton />
    </main>
  );
}
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className='text-4xl mb-10'>Main page</h1>
      <div className='flex gap-4'>
        <Link href={'login'} className={buttonVariants({ variant: 'default' })}>Login Page</Link>
        <Link href={'register'} className={buttonVariants({ variant: 'destructive' })}>Register Page</Link>
        <Link href={'dashboard'} className={buttonVariants({ variant: 'outline' })}>To the Dashboard</Link>
      </div>
    </main>
  );
}

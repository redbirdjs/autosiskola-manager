import { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Register'
}

export default function RegisterPage() {
  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <h1 className='text-4xl mb-10'>Register Page</h1>
      <Link href={'/'} className={buttonVariants({ variant: 'default' })}>Back To Main Page</Link>
    </main>
  )
}
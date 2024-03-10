import { Metadata } from 'next'
import Link from 'next/link'

import Required from '@/components/RequiredStar'
import RegisterForm from '@/components/RegisterForm'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Register'
}

export default function RegisterPage() {
  return (
    <main className='flex min-h-screen flex-row justify-between px-20 py-10'>
      <div>
        <Link href={'/'} className={buttonVariants({ variant: 'default' })}>Back To Main Page</Link>
      </div>
      <div className='self-center px-32'>
        <h1 className='text-center text-4xl'>Register</h1>
        <Separator className='my-5' />
        <RegisterForm />
        <p className='mb-3'>Already has an account? <Link href={'/login'} className='underline'>Click here to login</Link></p>
        <p><Required />: Fields with this symbol must be filled out.</p>
      </div>
    </main>
  )
}
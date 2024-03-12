'use client'
import Link from 'next/link'
import { useState } from 'react'
import { AlertMessageObject } from '@/lib/definitions'
import { UserPlus } from 'lucide-react'

import Required from '@/components/RequiredStar'
import RegisterForm from '@/components/RegisterForm'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default function RegisterPage() {
  const [message, setMessage] = useState<AlertMessageObject>({});

  const setMsg = (msg: AlertMessageObject) => {
    setMessage(msg);
  }

  return (
    <main className='flex min-h-screen flex-row justify-between px-20 py-10'>
      {
        message?.title && (
          <Alert variant={'default'} className='absolute w-max left-1/2 -translate-x-1/2'>
            <UserPlus className='h-5 w-5' />
            <AlertTitle>{ message.title }</AlertTitle>
            <AlertDescription>{ message.description }</AlertDescription>
          </Alert>
        )
      }
      <div>
        <Link href={'/'} className={buttonVariants({ variant: 'default' })}>Back To Main Page</Link>
      </div>
      <div className='self-center px-32'>
        <h1 className='text-center text-4xl'>Register</h1>
        <Separator className='my-5' />
        <RegisterForm setMsg={setMsg} />
        <p className='mb-3'>Already has an account? <Link href={'/login'} className='underline'>Click here to login</Link></p>
        <p><Required />: Fields with this symbol must be filled out.</p>
      </div>
    </main>
  )
}
'use client'
import Link from 'next/link'
import { useState } from 'react'
import { AlertMessageObject } from '@/lib/definitions'
import { Check } from 'lucide-react'

import LoginForm from '@/components/LoginForm'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const [message, setMessage] = useState<AlertMessageObject>({});

  const setMsg = (message: AlertMessageObject) => {
    setMessage(message);
  }

  return (
    <main className='flex min-h-screen flex-row justify-between px-20 py-10'>
      {
        message?.title && (
          <Alert variant={'default'} className='absolute w-max left-1/2 -translate-x-1/2'>
            <Check className='h-5 w-5' />
            <AlertTitle>{ message.title }</AlertTitle>
            <AlertDescription>{ message.description  }</AlertDescription>
          </Alert>
        )
      }
      <div>
        <Link href={'/'} className={buttonVariants({ variant: 'default' })}>Back To Main Page</Link>
      </div>
      <div className='self-center px-32'>
        <h1 className='text-center text-4xl'>Login Page</h1>
        <Separator className='my-5' />
        <LoginForm setMsg={setMsg} />
        <p>Don&apos;t have an account yet? <Link href={'/register'} className='underline'>Register an Account here</Link></p>
      </div>
    </main>
  );
}
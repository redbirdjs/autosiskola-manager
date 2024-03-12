'use client'

import { useState } from 'react'
import { Inbox } from 'lucide-react'

import PasswordReminderForm from '@/components/PasswordReminderForm'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { AlertMessageObject } from '@/lib/definitions'

export default function ForgottenPasswordPage() {
  const [message, setMessage] = useState<AlertMessageObject>({});

  const setMsg = (msg: AlertMessageObject) => {
    setMessage(msg);
  }

  return (
    <main className='flex min-h-screen flex-col'>
      {
        message?.title && (
          <Alert variant={'default'} className='absolute w-max left-1/2 -translate-x-1/2 my-20'>
            <Inbox className='h-5 w-5' />
            <AlertTitle>{ message.title }</AlertTitle>
            <AlertDescription>{ message.description }</AlertDescription>
          </Alert>
        )
      }
      <div className='flex min-h-screen flex-col justify-center items-center'>
        <div className='flex flex-col w-[30vw] items-center'>
          <h1 className='text-center text-4xl'>Forgot password</h1>
          <Separator className='my-5' />
          <div className='mb-10 w-[20vw]'>
            <p>If you forget your password, we can send you a password reminder.</p>
            <p>You have to specify a new password for your account by clicking the link we send you in the email.</p>
          </div>
          <PasswordReminderForm setMsg={setMsg} />
        </div>
      </div>
    </main>
  )
}
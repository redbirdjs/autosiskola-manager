'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AlertMessageObject } from '@/lib/definitions'
import { Check, ChevronLeft } from 'lucide-react'

import LoginForm from '@/components/LoginForm'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

import LoginImage from '@/static/car.png'

export default function LoginPage() {
  const [message, setMessage] = useState<AlertMessageObject>({});
  const router = useRouter();

  const setMsg = (message: AlertMessageObject) => {
    if (message.title?.length != 0) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    }
    setMessage(message);
  }

  return (
    <main className='flex flex-wrap min-h-screen flex-row gap-10 justify-between px-20 py-10 bg-login bg-cover'>
      <Image src={LoginImage} alt='logo' width={800} height={800} className='absolute top-1/2 -translate-y-1/2 left-30 rounded-lg' />
      {
        message?.title && (
          <Alert variant={'default'} className='absolute w-max left-1/2 -translate-x-1/2'>
            <Check className='h-5 w-5' />
            <AlertTitle>{ message.title }</AlertTitle>
            <AlertDescription>{ message.description  }</AlertDescription>
          </Alert>
        )
      }
      <div></div>
      <div className='self-center px-20 py-20 bg-white/80 backdrop-blur-sm rounded-lg lg:mr-40'>
        <h1 className='text-center text-4xl mb-10'>Login</h1>
        <Separator className='mb-10' />
        <LoginForm setMsg={setMsg} />
        <p className='text-center'>Don&apos;t have an account yet? <Link href={'/register'} className='underline'>Register a new account</Link></p>
      </div>
    </main>
  );
}
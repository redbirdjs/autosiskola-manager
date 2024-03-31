'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { AlertMessageObject } from '@/lib/definitions'
import { UserPlus, ChevronLeft } from 'lucide-react'

import Required from '@/components/RequiredStar'
import RegisterForm from '@/components/RegisterForm'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

import RegisterImage from '@/assets/bus.png'

export default function RegisterPage() {
  const [message, setMessage] = useState<AlertMessageObject>({});

  const setMsg = (msg: AlertMessageObject) => {
    setMessage(msg);
  }

  return (
    <main className='flex flex-wrap min-h-screen flex-row justify-between px-20 py-10 bg-register bg-cover'>
      <Image src={RegisterImage} alt='logo' width={800} height={800} placeholder='blur' className='absolute top-1/2 -translate-y-1/2 left-30 -z-10 rounded-lg' />
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
      <Link href={'/'} className={buttonVariants({ variant: 'default', className: 'relative pl-8 group transition-transform' })}><ChevronLeft className='absolute top-1/2 -translate-y-1/2 left-2 group-hover:-translate-x-1' size={20} /> Back To Main Page</Link>
      </div>
      <div className='self-center px-20 py-20 bg-white/80 backdrop-blur-sm rounded-lg lg:mr-40'>
        <h1 className='text-center text-4xl'>Register</h1>
        <Separator className='my-5' />
        <RegisterForm setMsg={setMsg} />
        <p className='mb-3'>Already has an account? <Link href={'/login'} className='underline'>Click here to login</Link></p>
        <p><Required />: Fields with this symbol must be filled out.</p>
      </div>
    </main>
  )
}
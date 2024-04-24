'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { AlertMessageObject } from '@/lib/definitions'
import { UserPlus } from 'lucide-react'

import Required from '@/components/RequiredStar'
import RegisterForm from '@/components/RegisterForm'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

import Logo from '@/static/logo.svg'
import RegisterImage from '@/static/car2.png'

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState<AlertMessageObject>({});

  const setMsg = (msg: AlertMessageObject) => {
    setMessage(msg);
  }

  useEffect(() => {
    if (message.title && message.title.length > 0) {
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    }
  }, [message, router]);

  return (
    <main className='flex flex-wrap min-h-screen flex-row gap-10 justify-center lg:justify-between px-20 py-10 bg-register bg-cover'>
      <Image src={RegisterImage} alt='logo' height={600} placeholder='blur' className='absolute top-1/2 -translate-y-1/2 left-40 rounded-lg' />
      {
        message?.title && (
          <Alert variant={'default'} className='absolute w-max left-1/2 -translate-x-1/2 z-20'>
            <UserPlus className='h-5 w-5' />
            <AlertTitle>{ message.title }</AlertTitle>
            <AlertDescription>{ message.description }</AlertDescription>
          </Alert>
        )
      }
      <div className='flex items-center gap-4 h-max z-10'>
        <Image src={Logo} alt='DSM Logo' width={50} height={50} />
        <div className='h-[60px] border border-black'></div>
        <h1 className='text-xl font-bold'>Driving School Manager</h1>
      </div>
      <div className='self-center p-10 lg:p-20 bg-white/80 backdrop-blur-sm rounded-lg lg:mr-40'>
        <h1 className='text-center text-4xl'>Register</h1>
        <Separator className='my-5' />
        <RegisterForm setMsg={setMsg} />
        <p className='mb-3'>Already have an account? <Link href={'/login'} className='underline'>Click here to login</Link></p>
        <p><Required />: These fields are required.</p>
      </div>
    </main>
  )
}
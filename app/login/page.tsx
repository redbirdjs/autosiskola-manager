'use client'

import Image from 'next/image'
import Link from 'next/link'

import LoginForm from '@/components/LoginForm'
import { Separator } from '@/components/ui/separator'

import Logo from '@/static/logo.svg'
import LoginImage from '@/static/car.png'

export default function LoginPage() {
  return (
    <main className='flex flex-wrap min-h-screen flex-row gap-10 justify-center lg:justify-between lg:px-20 py-10 bg-login bg-cover'>
      <Image src={LoginImage} alt='logo' width={800} height={800} className='absolute top-1/2 -translate-y-1/2 left-30 rounded-lg' />
      <div className='flex items-center gap-4 h-max z-10'>
        <Image src={Logo} alt='DSM Logo' width={50} height={50} />
        <div className='h-[60px] border border-black'></div>
        <h1 className='text-xl font-bold'>Driving School Manager</h1>
      </div>
      <div className='self-center p-10 lg:p-20 bg-white/80 backdrop-blur-sm rounded-lg lg:mr-40'>
        <h1 className='text-center text-4xl mb-10'>Login</h1>
        <Separator className='mb-10' />
        <LoginForm />
        <p className='text-center'>Don&apos;t have an account yet? <Link href={'/register'} className='underline'>Register a new account</Link></p>
      </div>
    </main>
  );
}
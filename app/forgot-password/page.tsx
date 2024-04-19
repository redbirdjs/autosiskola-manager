'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import PasswordReminderForm from '@/components/PasswordReminderForm'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'

export default function ForgottenPasswordPage() {
  return (
    <Card className='w-2/3 lg:w-1/4'>
      <CardHeader>
      <Link href={'/'} className={buttonVariants({ variant: 'default', className: 'w-max mb-3 relative pl-8 group transition-transform' })}><ChevronLeft className='absolute top-1/2 -translate-y-1/2 left-2 group-hover:-translate-x-1' size={20} /> Back to Main Menu</Link>
        <CardTitle className='text-center'>Forgotten Password</CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <CardDescription className='mb-3'>If you forget your password. You can request a password reset link by typing in your email address.</CardDescription>
        <PasswordReminderForm />
      </CardContent>
    </Card>
  )
}
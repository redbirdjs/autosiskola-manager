import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ChevronLeft } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import ResetPasswordForm from '@/components/reset-password/ResetPasswordForm'

export default function ResetPasswordPage({ searchParams }: { searchParams: { token: string } }) {
  const session = cookies().get('refreshToken');
  const token = searchParams?.token;

  if (session || !token) redirect('/');

  return (
    <Card className='w-2/3 lg:w-1/4'>
      <CardHeader>
        <Link href={'/'} className={buttonVariants({ variant: 'default', className: 'w-max mb-3 relative pl-8 group transition-transform' })}><ChevronLeft className='absolute top-1/2 -translate-y-1/2 left-2 group-hover:-translate-x-1' size={20} /> Back to Main Menu</Link>
        <CardTitle className='text-center'>Reset Password</CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <CardDescription className='mb-3'>You can set a new password for your account. After setting the new password you can login.</CardDescription>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}
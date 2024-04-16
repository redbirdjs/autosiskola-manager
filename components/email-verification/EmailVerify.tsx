import Link from 'next/link'
import { UserCheck, UserRoundX } from 'lucide-react'
import { verifyEmail } from '@/utils/user-actions'

import { buttonVariants } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default async function EmailVerify({ verifyToken }: { verifyToken: string }) {
  const verify = await verifyEmail({ verifyToken });

  return (
    <div className='min-w-screen min-h-screen flex flex-col gap-3 items-center justify-center'>
      { verify.error && (
        <>
          <Alert className='w-max'>
            <UserRoundX className='h-5 w-5' />
            <AlertTitle>{ verify.error.title }</AlertTitle>
            <AlertDescription>{ verify.error.description }</AlertDescription>
          </Alert>
          <Link className={buttonVariants({ variant: 'default' })} href={'/'}>Back to Main Menu</Link>
        </>
      )
      }
      {
        verify.message && (
          <>
            <Alert className='w-max'>
              <UserCheck className='h-5 w-5' />
              <AlertTitle>{ verify.message.title }</AlertTitle>
              <AlertDescription>
                <p>{ verify.message.description }</p>
                <p>You will be redirected to the home page in 2 seconds...</p>
                <p>If the redirect does not work, use the button below:</p>
              </AlertDescription>
            </Alert>
            <Link className={buttonVariants({ variant: 'default' })} href={'/'}>Back to Main Menu</Link>
          </>
        )
      }
    </div>
  );
}
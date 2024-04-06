'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Bomb } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  const router = useRouter();
  
  useEffect(() => {
    console.error(error);
  }, [error]);

  const redirectDashboard = () => {
    router.push('/dashboard');
  }

  return (
    <div className='flex flex-col gap-5 w-full items-center justify-center p-5'>
      <Alert className='w-max' variant={'destructive'}>
        <Bomb className='w-5 h-5' />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>There was an error while trying to fetch the user data!</AlertDescription>
      </Alert>
      <Button variant={'default'} onClick={reset}>Try Again</Button>
      <Button variant={'default'} onClick={redirectDashboard}>Back to the Dasboard</Button>
    </div>
  )
}
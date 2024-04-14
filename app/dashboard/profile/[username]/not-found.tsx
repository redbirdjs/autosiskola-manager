import { UserRoundX } from 'lucide-react'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default function ProfileNotFound() {
  return (
    <div className='w-full min-h-[600px] flex flex-col justify-center items-center'>
      <Alert className='w-max'>
        <UserRoundX className='h-5 w-5' />
        <AlertTitle>Profile not found!</AlertTitle>
        <AlertDescription>The profile you are looking for does not exist.</AlertDescription>
      </Alert>
    </div>
  );
}
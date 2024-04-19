import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className='w-screen h-screen flex flex-col gap-3 items-center justify-center'>
      <div className='flex'>
        <h1 className='text-xl font-bold pr-3 mr-3 border-r border-r-[#eaeaea]'>404</h1>
        <p>The page is not found!</p>
      </div>
      <Link href={'/'} className={buttonVariants({ variant: 'default' })}>Back to Main Menu</Link>
    </div>
  )
}
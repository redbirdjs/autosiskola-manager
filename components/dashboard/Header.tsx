import Image from 'next/image'
import { UserRound } from 'lucide-react'

import Logo from '@/assets/logo.svg'
import { Badge } from '@/components/ui/badge'
import { getUserData } from '@/utils/actions'
import LogoutButton from '@/components/LogoutButton'

export default async function Header() {
  const user = await getUserData();

  return (
    <header className='flex flex-row justify-end px-10 py-5 border-b border-b-[#eaeaea]'>
      <Image src={Logo} alt='DSM Logo' width={55} className='absolute left-1/2 -translate-x-1/2' />
      <div className='flex flex-row items-center gap-2'>
        <div className='flex flex-row gap-4 items-center p-2 rounded-md'>
          <div className='flex flex-col'>
            <p className='text-lg'>{ user?.username }</p>
            <Badge className='self-start'>{ user?.rank }</Badge>
          </div>
          { user?.avatarPath.endsWith('default.svg') && <UserRound className='h-12 w-12 rounded-full text-white bg-black p-2' /> || <Image src={`${user?.avatarPath}`} width={42} height={42} className='rounded-full' priority={true} alt={`${user?.username}'s profile avatar`} /> }
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
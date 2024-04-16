import Image from 'next/image'

import Logo from '@/static/logo.svg'
import { Badge } from '@/components/ui/badge'
import { getUserData } from '@/utils/user-actions'
import LogoutButton from '@/components/LogoutButton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { getImageProvider } from '@/lib/utils'

export default async function Header() {
  const user = await getUserData();
  const provider = getImageProvider();

  const imageSrc = `${provider}${user?.avatarPath}`

  return (
    <header className='flex flex-row justify-end px-10 py-5 border-b border-b-[#eaeaea]'>
      <Image src={Logo} alt='DSM Logo' width={55} className='max-md:mr-auto md:absolute md:left-1/2 md:-translate-x-1/2' />
      <div className='flex flex-row items-center gap-2'>
        <div className='flex flex-row gap-4 items-center p-2 rounded-md'>
          <div className='flex flex-col'>
            <p className='text-base'>{ user?.realname }</p>
            <Badge className='self-center'>{ user?.rank }</Badge>
          </div>
          <Avatar className='w-12 h-12'>
            <AvatarImage src={imageSrc} />
            <AvatarFallback>{ user?.realname.split(' ').map(x => x[0]).join('') }</AvatarFallback>
          </Avatar>
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
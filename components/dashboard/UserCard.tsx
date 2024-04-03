import Image from 'next/image'
import { UserRound } from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { badgeVariants } from '@/components/ui/badge'
import clsx from 'clsx';

interface UserData {
  path: string;
  realname: string;
  username: string;
  email: string;
  rank: string;
}

export default function UserCard({ user }: { user: UserData }) {
  return (
    <div className='flex flex-row gap-5 border border-[#eaeaea] rounded-lg mb-3 p-5 hover:bg-gray-100 hover:border-gray-300 transition-colors'>
      <Avatar className='border border-gray-300'>
        <AvatarImage src={ user.path } />
        <AvatarFallback>{ user.realname.split(' ').map(x => x[0]).join('') }</AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-1 justify-center'>
        <h1 className='text-2xl'>{ user.realname } ({ user.username })</h1>
        <p className='text-[#a0a0a0] text-base'>{ user.email }</p>
      </div>
      <p className={badgeVariants({ variant: 'outline', className: clsx('self-center border-black cursor-default', { 'border-red-600': user.rank == 'Admin' }) })}>{ user.rank }</p>
    </div>
  );
}
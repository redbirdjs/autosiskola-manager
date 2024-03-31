import Image from 'next/image'
import { UserRound } from 'lucide-react';

import { badgeVariants } from '@/components/ui/badge';

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
      { user.path ? (
        <Image src={user.path} alt='User Image' width={75} height={75} className='rounded-full flex items-center text-center border border-[#eaeaea]' />
      ) : (
        <div className='w-[75px] h-[75px] rounded-full flex items-center justify-center border border-[#eaeaea]'>
          <UserRound className='self-center text-gray-400' size={40} />
        </div>
      ) }
      <div className='flex flex-col gap-1 justify-center'>
        <h1 className='text-2xl'>{ user.realname } ({ user.username })</h1>
        <p className='text-[#a0a0a0] text-base'>{ user.email }</p>
      </div>
      <p className={badgeVariants({ variant: 'outline', className: 'self-center text-base border-black cursor-default' })}>{ user.rank }</p>
    </div>
  );
}
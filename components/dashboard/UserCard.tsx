'use client'

import Link from 'next/link'
import clsx from 'clsx'
import { MoreHorizontal, Clipboard, UserRound } from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { badgeVariants } from '@/components/ui/badge'
import DeleteUserButton from './users/DeleteUserButton'
import { toast } from '@/components/ui/use-toast'
import { UserData } from '@/lib/definitions'

export default function UserCard({ loggedUser, user, provider, rank }: { loggedUser: string, user: UserData, provider: string, rank: string }) {
  const copyUsername = (username: string) => {
    navigator.clipboard.writeText(username);

    toast({
      title: 'Username successfully copied!',
      duration: 2000
    });
  }

  const imageSrc = `${provider}${user.path}`;
  return (
    <div className='min-w-[500px] flex flex-row items-center gap-5 border border-[#eaeaea] rounded-lg mb-3 p-5 hover:bg-gray-100 hover:border-gray-300 transition-colors'>
      <Avatar className='border border-gray-300'>
        <AvatarImage src={imageSrc} />
        <AvatarFallback>{ user.realname.split(' ').map(x => x[0]).join('') }</AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-1 justify-center'>
        <h1 className='text-2xl'>{ user.realname } ({ user.username })</h1>
        <p className='text-[#a0a0a0] text-base'>{ user.email }</p>
      </div>
      <p className={badgeVariants({ variant: 'outline', className: clsx('self-center border-black cursor-default', { 'border-red-600': user?.rank == 'Admin' }) })}>{ user?.rank }</p>
      <div className='ml-auto'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'} className='h-8 w-8'>
              <span className='sr-only'>Open Menu</span>
              <MoreHorizontal className='min-h-5 min-w-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='flex gap-2' onClick={() => copyUsername(user.username)}>
              <Clipboard className='h-5 w-5' /> Copy Username
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className='flex gap-2' href={`/dashboard/profile/${user.username}`}><UserRound className='h-5 w-5' /> Go to User Profile</Link>
            </DropdownMenuItem>
            { rank.toLowerCase() == 'admin' && user.username != loggedUser && <DeleteUserButton username={user.username} /> }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
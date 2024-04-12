import Link from 'next/link'
import clsx from 'clsx'
import { MoreHorizontal, Clipboard, Trash2 as Trash } from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { badgeVariants } from '@/components/ui/badge'
import { UserData } from '@/lib/definitions'

export default function UserCard({ user }: { user: UserData }) {
  return (
    <div className='flex flex-row items-center gap-5 border border-[#eaeaea] rounded-lg mb-3 p-5 hover:bg-gray-100 hover:border-gray-300 transition-colors'>
      <Avatar className='border border-gray-300'>
        <AvatarImage src={ user.path } />
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
            <DropdownMenuItem className='flex gap-2'>
              <Clipboard className='h-5 w-5' /> Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='flex gap-2 text-red-600'>
              <Trash className='h-5 w-5' /> Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
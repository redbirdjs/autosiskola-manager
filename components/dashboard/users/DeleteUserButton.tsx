import { Trash2 as Trash } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { deleteUser } from '@/utils/user-actions'

export default function DeleteUserButton({ username }: { username: string }) {
  return (
    <DropdownMenuItem className='flex gap-2 text-red-600' onClick={() => deleteUser({ username })}>
      <Trash className='h-5 w-5' /> Delete User
    </DropdownMenuItem>
  );
}
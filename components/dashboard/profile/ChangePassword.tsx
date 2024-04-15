'use client'

import { useFormState } from 'react-dom'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogContent, DialogClose, DialogFooter } from '@/components/ui/dialog'
import { changePassword } from '@/utils/actions'

export default function ChangePasswordForm({ userId }: { userId: number }) {
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(changePassword, initialState);
 
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form action={dispatch}>
          <Input id='userId' name='userId' value={userId} className='hidden' readOnly />
          <label htmlFor='oldpass'>Old Password</label>
          <Input type='password' id='oldpass' name='oldpass' className='mt-1 mb-3' />
          <label htmlFor='newpass1'>New Password</label>
          <Input type='password' id='newpass1' name='newpass1' className='mt-1 mb-3' />
          <label htmlFor='newpass2'>Repeat Password</label>
          <Input type='password' id='newpass2' name='newpass2' className='mt-1 mb-3' />
          <DialogFooter>
            <DialogClose asChild>
              <Button type='submit'>Change Password</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
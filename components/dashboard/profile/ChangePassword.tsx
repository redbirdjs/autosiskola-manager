'use client'

import { useFormState } from 'react-dom'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogContent, DialogClose, DialogFooter } from '@/components/ui/dialog'

export default function ChangePasswordForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form>
          <label htmlFor='old-pass'>Old Password</label>
          <Input type='password' id='old-pass' name='old-pass' className='mt-1 mb-3' />
          <label htmlFor='new-pass1'>New Password</label>
          <Input type='password' id='new-pass1' name='new-pass1' className='mt-1 mb-3' />
          <label htmlFor='new-pass2'>Repeat Password</label>
          <Input type='password' id='new-pass2' name='new-pass2' className='mt-1 mb-3' />
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
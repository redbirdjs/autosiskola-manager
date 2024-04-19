'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { logout } from '@/utils/user-actions'
import { changePassword } from '@/utils/profile-actions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogContent, DialogClose, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import RequiredStar from '@/components/RequiredStar'

export default function ChangePasswordForm({ userId }: { userId: number }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(changePassword, initialState);
 
  const closeDialog = () => {
    if (dialogOpen) {
      setDialogOpen(false);
    }
  }

  useEffect(() => {
    if (state.errors && Object.values(state.errors).length > 0) {
      toast({
        title: 'Error!',
        description: Object.values(state.errors).map((err) => (
          <div key={err[0]} aria-live='polite' aria-atomic>
            <p>{ err[0] }</p>
          </div>
        )),
        duration: 2000,
        variant: 'destructive'
      });
      setDialogOpen(true);
    }
    if (state.message && state.message.title.length > 0) {
      toast({
        title: state.message.title,
        description: state.message.description,
        duration: 2000
      });
      setDialogOpen(false);
      setTimeout(() => {
        logout();
      }, 2000);
    }
  }, [state]);

  return (
    <Dialog open={dialogOpen} onOpenChange={closeDialog}>
      <DialogTrigger asChild>
        <Button onClick={() => setDialogOpen(true)}>Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form action={dispatch}>
          <Input id='userId' name='userId' value={userId} className='hidden' readOnly />
          <label htmlFor='oldpass'>Old Password <RequiredStar /></label>
          <Input type='password' id='oldpass' name='oldpass' className='mt-1 mb-3' />
          <label htmlFor='newpass1'>New Password <RequiredStar /></label>
          <Input type='password' id='newpass1' name='newpass1' className='mt-1 mb-3' />
          <label htmlFor='newpass2'>Repeat Password <RequiredStar /></label>
          <Input type='password' id='newpass2' name='newpass2' className='mt-1 mb-3' />
          <DialogFooter>
            <DialogClose asChild>
              <Button type='submit'>Change Password</Button>
            </DialogClose>
          </DialogFooter>
          <p className='text-sm text-[#a0a0a0]'><RequiredStar/>: These fields are required!</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
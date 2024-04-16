'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { logout } from '@/utils/user-actions'
import { changeEmail } from '@/utils/profile-actions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogContent, DialogClose, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'

export default function ModifyEmailForm({ userId }: { userId: number }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(changeEmail, initialState);

  const closeDialog = () => {
    if (dialogOpen) {
      setDialogOpen(false);
    }
  }

  useEffect(() => {
    if (state.message.title && state.message.title.length > 0) {
      toast({
        title: state.message.title,
        description: state.message.description,
        duration: 2000,
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
        <Button onClick={() => setDialogOpen(true)}>Modify Email</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify Email Address</DialogTitle>
        </DialogHeader>
        <form action={dispatch}>
          <Input id='userId' name='userId' value={userId} className='hidden' readOnly />
          <label htmlFor='avatar'>New Email</label>
          <Input type='email' id='email' name='email' className='mt-1 mb-3' />
          <DialogFooter>
            <DialogClose asChild>
              <Button type='submit'>Modify Email</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
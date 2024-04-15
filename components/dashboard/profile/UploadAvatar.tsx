'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { uploadProfileAvatar } from '@/utils/actions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogContent, DialogClose, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'

export default function UploadAvatarForm({ userId }: { userId: number }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(uploadProfileAvatar, initialState);

  useEffect(() => {
    if (state.message.title.length > 0) {
      toast({
        title: state.message.title,
        description: state.message.description,
        variant: 'default',
        duration: 2000
      });
      setDialogOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setDialogOpen(true)}>Upload Avatar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avatar Upload</DialogTitle>
        </DialogHeader>
        <form action={dispatch}>
          <Input type='text' id='userId' name='userId' value={userId} className='hidden' readOnly />
          <label htmlFor='avatar'>Avatar</label>
          <Input type='file' id='avatar' name='avatar' className='mt-1 mb-3' />
          <DialogFooter>
            <DialogClose asChild>
              <Button type='submit'>Upload</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
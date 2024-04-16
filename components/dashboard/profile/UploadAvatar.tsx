'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useFormState } from 'react-dom'
import { uploadProfileAvatar } from '@/utils/actions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogContent, DialogClose, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'

export default function UploadAvatarForm({ userId }: { userId: number }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [image, setImage] = useState<File>();

  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(uploadProfileAvatar, initialState);

  const changeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  }

  const closeModal = () => {
    if (dialogOpen) {
      setDialogOpen(false);
      setImage(undefined);
    }
  }

  useEffect(() => {
    if (state.message.title.length > 0) {
      toast({
        title: state.message.title,
        description: state.message.description,
        variant: 'default',
        duration: 2000
      });
      setDialogOpen(false);
      setImage(undefined);
    }
  }, [state]);

  return (
    <Dialog open={dialogOpen} onOpenChange={closeModal}>
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
          {
            image && (
              <Avatar className='mx-auto my-5 w-60 h-60'>
                <AvatarImage src={URL.createObjectURL(image)} />
                <AvatarFallback>Avatar Preview</AvatarFallback>
              </Avatar>
            )
          }
          <Input type='file' id='avatar' name='avatar' onChange={changeImage} className='mt-1 mb-3' />
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
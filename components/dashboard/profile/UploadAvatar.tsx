'use client'

import { useFormState } from 'react-dom'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogContent, DialogClose, DialogFooter } from '@/components/ui/dialog'

export default function UploadAvatarForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload Avatar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avatar Upload</DialogTitle>
        </DialogHeader>
        <form>
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
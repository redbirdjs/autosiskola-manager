'use client'

import { useFormState } from 'react-dom'
import { changeEmail } from '@/utils/actions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogContent, DialogClose, DialogFooter } from '@/components/ui/dialog'

export default function ModifyEmailForm({ userId }: { userId: number }) {
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(changeEmail, initialState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Modify Email</Button>
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
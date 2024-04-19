'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import clsx from 'clsx'
import { passwordReminder } from '@/utils/user-actions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

export default function PasswordReminderForm() {
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(passwordReminder, initialState);

  useEffect(() => {
    if (state.message && state.message.title.length > 0) {
      toast({
        title: state.message.title,
        description: state.message.description,
        duration: 2000
      });
    }
  }, [state]);

  return (
    <form action={dispatch} className='flex flex-col'>
      <label htmlFor='email' className='mb-1'>Email address</label>
      <Input name='email' className={clsx(state.errors?.email ? 'mb-1' : 'mb-3')} />
      {
        state.errors?.email && (
          <div aria-live='polite' aria-atomic>
            <p className='text-red-600 mb-3'>{ state.errors.email[0] }</p>
          </div>
        )
      }
      <div className='flex flex-row gap-2 justify-center flex-wrap'>
        <Button type='submit' className='self-center'>Send reminder</Button>
      </div>
    </form>
  )
}
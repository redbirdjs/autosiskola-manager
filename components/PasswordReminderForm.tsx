'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import clsx from 'clsx'

import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { passwordReminder } from '@/utils/actions'
import { useEffect } from 'react'

export default function PasswordReminderForm({ setMsg }: { setMsg: Function }) {
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(passwordReminder, initialState);

  useEffect(() => {
    setMsg(state.message);
  }, [state, setMsg]);

  return (
    <form action={dispatch} className='flex flex-col w-[60%]'>
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
        <Link href='/' className={buttonVariants({ variant: 'default' })}>Back to Main Page</Link>
      </div>
    </form>
  )
}
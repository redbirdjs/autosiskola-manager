'use client'

import Link from 'next/link'
import { clsx } from 'clsx'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'

import { login } from '@/utils/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginForm({ setMsg }: { setMsg: Function }) {
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(login, initialState);

  useEffect(() => {
    setMsg(state.message);
  }, [state, setMsg]);

  return (
    <form action={dispatch} className='flex flex-col'>
      <label htmlFor='email' className='mb-1'>Email address</label>
      <Input name='email' type='email' className={clsx({ 'border-red-600': state.errors?.email, 'mb-3': !state.errors?.email })} />
      {
        state.errors?.email && (
          <div aria-live='polite' aria-atomic>
            <p className='text-red-600'>{ state.errors.email[0] }</p>
          </div>
        )
      }
      <label htmlFor='password' className='mb-1'>Password</label>
      <Input name='password' type='password' className={clsx({ 'border-red-600': state.errors?.password }, 'mb-1')} />
      {
        state.errors?.password && (
          <div aria-live='polite' aria-atomic>
            <p className='text-red-600'>{ state.errors.password[0] }</p>
          </div>
        )
      }
      <p className='mb-3 underline'><Link href='/forgot-password'>Forgot password?</Link></p>
      <Button type='submit' variant={'default'} className='my-5 self-center w-[50%]'>Login</Button>
    </form>
  )
}
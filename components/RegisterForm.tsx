'use client'

import { clsx } from 'clsx'
import { useFormState } from 'react-dom'
import { REGEXP_ONLY_DIGITS_AND_CHARS as Pattern } from 'input-otp'

import Required from '@/components/RequiredStar'
import { register } from '@/utils/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

export default function RegisterForm() {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(register, initialState);

  return (
    <form action={dispatch} className='flex flex-col'>
      <label htmlFor="username" className='mb-2'>Username <Required /></label>
      <Input name='username' className='mb-3' />
      {
        state.errors?.username && state.errors.username.map(error => (
          <div key={error}>
            <p className='text-red-600'>{ error }</p>
          </div>
        ))
      }
      <label htmlFor="realname" className='mb-2'>Full Name <Required /></label>
      <Input name='realname' className='mb-3' />
      {
        state.errors?.realname && state.errors.realname.map(error => (
          <div key={error}>
            <p className='text-red-600'>{ error }</p>
          </div>
        ))
      }
      <label htmlFor="email" className='mb-2'>Email address <Required /></label>
      <Input name='email' className='mb-3' />
      {
        state.errors?.email && state.errors.email.map(error => (
          <div key={error}>
            <p className='text-red-600'>{ error }</p>
          </div>
        ))
      }
      <label htmlFor='passport' className='mb-2'>Passport Number <Required /></label>
      <InputOTP className='mb-3' name='passport' pattern={Pattern} maxLength={9} render={({ slots }) => (
        <>
          <InputOTPGroup>
            {slots.slice(0, 9).map((slot, i) => (
              <InputOTPSlot className={clsx({ 'border-red-600': state.errors?.passport })} key={i} {...slot} />
            ))}
          </InputOTPGroup>
        </>
      )} />
      {
        state.errors?.passport && state.errors.passport.map(error => (
          <div key={error}>
            <p className='text-red-600'>{ error }</p>
          </div>
        ))
      }
      <label htmlFor="pass1" className='mb-2'>Password <Required /></label>
      <Input name='pass1' type='password' className='mb-3' />
      {
        state.errors?.pass1 && state.errors.pass1.map(error => (
          <div key={error}>
            <p className='text-red-600'>{ error }</p>
          </div>
        ))
      }
      <label htmlFor="pass2" className='mb-2'>Repeat password <Required /></label>
      <Input name='pass2' type='password' className='mb-3' />
      {
        state.errors?.pass2 && state.errors.pass2.map(error => (
          <div key={error}>
            <p className='text-red-600'>{ error }</p>
          </div>
        ))
      }
      <Button type='submit' variant={'default'} className='my-5 self-center w-[50%]'>Register</Button>
    </form>
  )
}
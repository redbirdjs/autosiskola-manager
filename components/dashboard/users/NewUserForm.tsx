'use client'

import { Plus } from 'lucide-react'
import { useFormState } from 'react-dom'
import { REGEXP_ONLY_DIGITS_AND_CHARS as Pattern } from 'input-otp'
import { createUser } from '@/utils/user-actions'

import RequiredStar from '@/components/RequiredStar'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { SheetFooter, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function NewUserForm() {
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(createUser, initialState);

  return (
    <form action={dispatch}>
      <label htmlFor='username'>Username <RequiredStar /></label>
      <Input id='username' name='username' className='mt-1 mb-3' />
      <label htmlFor='realname'>Real Name <RequiredStar /></label>
      <Input id='realname' name='realname' className='mt-1 mb-3' />
      <label htmlFor='email'>Email <RequiredStar /></label>
      <Input id='email' name='email' type='email' className='mt-1 mb-3' />
      <label id='passport'>Passport No. <RequiredStar /></label>
      <InputOTP id='passport' name='passport' className='mt-1 mb-3 w-full' maxLength={9} pattern={Pattern} render={({ slots }) => (
        <>
          <InputOTPGroup className='w-full'>
            {slots.slice(0, 9).map((slot, i) => (
              <InputOTPSlot key={i} {...slot} />
            ))}
          </InputOTPGroup>
        </>
      )} />
      <SheetFooter>
        <SheetClose asChild>
          <Button type='submit'><Plus className='h-5 w-5' /> New User</Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
}
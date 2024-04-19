'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { Eye, EyeOff } from 'lucide-react'
import { changeForgottenPassword } from '@/utils/user-actions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import RequiredStar from '@/components/RequiredStar'

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState('password');
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(changeForgottenPassword, initialState);

  const changePasswordState = () => {
    const state = showPassword == 'password' ? 'text' : 'password';
    setShowPassword(state);
  }

  useEffect(() => {
    if (state.message.title && state.message.title.length > 0) {
      toast({
        title: state.message.title,
        description: state.message.description,
        duration: 2000
      });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }, [state, router]);

  return (
    <form action={dispatch}>
      <Input id='passToken' name='passToken' value={token} className='hidden' readOnly /> 
      <label htmlFor='pass1'>Password <RequiredStar /></label>
      {
        state.errors?.pass1 && (
          <div aria-live='polite' aria-atomic>
            <p className='text-red-600'>{ state.errors.pass1[0] }</p>
          </div>
        )
      }
      <div className='relative'>
        <p onClick={() => changePasswordState()} className='absolute top-1/2 -translate-y-1/2 right-5'>{ showPassword == 'password' ? <Eye className='h-6 w-6' /> : <EyeOff className='h-6 w-6' /> }</p>
        <Input type={showPassword} id='pass1' name='pass1' className='mt-1 mb-3' />
      </div>
      <label htmlFor='pass2'>Repeat Password <RequiredStar /></label>
      {
        state.errors?.pass2 && (
          <div aria-live='polite' aria-atomic>
            <p className='text-red-600'>{ state.errors.pass2[0] }</p>
          </div>
        )
      }
      <Input type={showPassword} id='pass2' name='pass2' className='mt-1 mb-3' />
      {
        state.errors?.passToken && (
          <div aria-live='polite' aria-atomic>
            <p className='text-red-600'>{ state.errors.passToken[0] }</p>
          </div>
        )
      }
      <Button type='submit' className='mb-3'>Reset Password</Button>
      <p className='text-sm'><RequiredStar />: These fields are required.</p>
    </form>
  );
}
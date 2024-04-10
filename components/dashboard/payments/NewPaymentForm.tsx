'use client'

import { Plus } from 'lucide-react'
import { useFormState } from 'react-dom'

import { SheetFooter, SheetClose } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import RequiredStar from '@/components/RequiredStar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StudentFormData } from '@/lib/definitions'

export default function NewPaymentForm({ students }: { students: StudentFormData[] }) {
  const initialState = { message: { title: '' }, errors: {} };

  return (
    <form>
      <label htmlFor='course'>Course <RequiredStar /></label>
      <div className='mt-1 mb-3'>
        <Select name='course'>
          <SelectTrigger>
            <SelectValue placeholder='Select a student...' />
          </SelectTrigger>
          <SelectContent>
            {
              students.map(course => (
                <SelectItem key={course.id} value={course.id.toString()}>[{ course.category }] #{ course.id } - { course.student.realname }</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      <label htmlFor='description'>Description <RequiredStar /></label>
      <Input className='mt-1 mb-3' id='description' name='description' />
      <label htmlFor='amount'>Amount <RequiredStar /></label>
      <Input className='mt-1 mb-3' type='number' id='amount' name='amount' defaultValue={0} min={0} max={10000} />
      <label htmlFor='due'>Due <RequiredStar /></label>
      <Input className='mt-1 mb-3' type='datetime-local' id='due' name='due' defaultValue={Date.now().toString()} />
      <SheetFooter className='mb-3'>
        <SheetClose asChild>
          <Button type='submit'><Plus className='h-5 w-5' /> New Payment</Button>
        </SheetClose>
      </SheetFooter>
      <p className='text-gray-500 text-sm'><RequiredStar />: These fields must be filled out.</p>
    </form>
  );
}
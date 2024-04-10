'use client'

import { Plus } from 'lucide-react'
import { useFormState } from 'react-dom'
import { createExam } from '@/utils/actions'

import { SheetFooter, SheetClose } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import RequiredStar from '@/components/RequiredStar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StudentFormData } from '@/lib/definitions'

export default function NewExamForm({ students }: { students: StudentFormData[] }) {
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(createExam, initialState);

  return (
    <form action={dispatch}>
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
      <label htmlFor='date'>Date <RequiredStar /></label>
      <Input className='mt-1 mb-3' type='datetime-local' id='date' name='date' />
      <SheetFooter className='mb-3'>
        <SheetClose asChild>
          <Button type='submit'><Plus className='w-5 h-5' /> New</Button>
        </SheetClose>
      </SheetFooter>
      <p className='text-gray-500 text-sm'><RequiredStar />: These fileds must be filled.</p>
    </form>
  );
}
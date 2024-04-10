'use client'

import { Plus } from 'lucide-react'
import clsx from 'clsx'
import { FormEvent } from 'react'
import { useFormState } from 'react-dom'

import { SheetFooter, SheetClose } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import RequiredStar from '@/components/RequiredStar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExamStudentData } from '@/lib/definitions'

export default function NewExamForm({ courses }: { courses: ExamStudentData[] }) {
  const initialState = { message: { title: '' }, errors: {} };

  const logChange = (e: string) => {
    console.log(e);
  }

  return (
    <form>
      <label htmlFor='course'>Course <RequiredStar /></label>
      <div className='mt-1 mb-3'>
        <Select name='course' onValueChange={(e) => logChange(e)}>
          <SelectTrigger>
            <SelectValue placeholder='Select a student...' />
          </SelectTrigger>
          <SelectContent>
            {
              courses.map(course => (
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
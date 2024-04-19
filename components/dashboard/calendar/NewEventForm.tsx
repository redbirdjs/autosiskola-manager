'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import { newCalendarEvent } from '@/utils/calendar-actions'

import { SheetFooter, SheetClose } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import RequiredStar from '@/components/RequiredStar'
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select'
import { StudentFormData } from '@/lib/definitions'

export default function NewEventForm({ students }: { students: StudentFormData[] }) {
  const [color, setColor] = useState('#000000');
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(newCalendarEvent, initialState);

  return (
    <form action={dispatch}>
      <label>Student <RequiredStar /></label>
      <div className='mt-1 mb-3'>
        <Select name='userId'>
          <SelectTrigger>
            <SelectValue placeholder='Select a student...' />
          </SelectTrigger>
          <SelectContent>
            {
              students.map((course) => (
                <SelectItem key={course.id} value={course.student.id.toString()}>[{ course.category }] { course.student.realname }</SelectItem>
              ))
            }
            { students.length == 0 && <SelectItem value='-1' disabled>No students found.</SelectItem> }
          </SelectContent>
        </Select>
      </div>
      <label htmlFor='date'>Date <RequiredStar /></label>
      <Input type='datetime-local' id='date' name='date' className='mt-1 mb-3' />
      <label htmlFor='title'>Title <RequiredStar /></label>
      <Input id='title' name='title' className='mt-1 mb-3' />
      <label htmlFor='description'>Description</label>
      <Input id='description' name='description' className='mt-1 mb-3' />
      <label htmlFor='color'>Color</label>
      <div className='flex gap-2 mt-1 mb-3'>
        <Input type='color' id='color' name='color' value={color} onChange={(e) => setColor(e.target.value)} />
        <Input type='text' value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      <SheetFooter className='mb-3'>
        <SheetClose asChild>
          <Button type='submit'><Plus className='h-5 w-5' /> Add Event</Button>
        </SheetClose>
      </SheetFooter>
      <p className='text-gray-500 text-sm'><RequiredStar />: These fields are required.</p>
    </form>
  );
}
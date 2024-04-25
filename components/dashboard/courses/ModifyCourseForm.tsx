'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogFooter, DialogClose } from '@/components/ui/dialog'
import { modifyCourseData } from '@/utils/course-actions'

export default function ModifyCourseForm({ courseId }: { courseId: number }) {
  const [theory, setTheory] = useState('0');
  const [practise, setPractise] = useState('0');

  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(modifyCourseData, initialState);

  return (
    <form action={dispatch}>
      <Input id='courseId' name='courseId' value={courseId} className='hidden' readOnly />
      <label htmlFor='theory'>Theory %</label>
      <div className='flex items-center gap-2 mb-3'>
        <Input type='range' id='theory' name='theory' min={0} max={100} defaultValue={theory} onChange={(e) => setTheory(e.target.value)} />
        <p className='min-w-max'>{ theory } %</p>
      </div>
      <label>Practise %</label>
      <div className='flex items-center gap-2 mb-3'>
        <Input type='range' id='practise' name='practise' min={0} max={100} defaultValue={practise} onChange={(e) => setPractise(e.target.value)} />
        <p className='min-w-max'>{ practise } %</p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type='submit'>Modify</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
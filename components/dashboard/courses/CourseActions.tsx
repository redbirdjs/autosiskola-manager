import { BookCheck, FilePenLine, Trash2 as Trash } from 'lucide-react'
import { setCourseToFinished, deleteCourse } from '@/utils/course-actions'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'

async function setCourseToFin(id: number) {
  const result = await setCourseToFinished(id);
  toast({
    title: result.message.title,
    description: result.message.description,
    duration: 2000
  });
}

async function delCourse(id: number) {
  const result = await deleteCourse(id);
  toast({
    title: result.message.title,
    description: result.message.description,
    duration: 2000
  });
}

export function SetCourseFinished({ state, courseId }: { state: boolean, courseId: number }) {
  return (
    <DropdownMenuItem className='flex gap-2' disabled={state} onClick={() => setCourseToFin(courseId)}>
      <BookCheck className='h-5 w-5' /> Set Course as Finished
    </DropdownMenuItem>
  );
}

export function ModifyCourseData({ setOpen }: { setOpen: (state: boolean) => void }) {
  return (
    <DropdownMenuItem className='flex gap-2' onClick={() => setOpen(true)}>
      <FilePenLine className='h-5 w-5' /> Modify Course
    </DropdownMenuItem>
  );
}

export function DeleteCourse({ courseId }: { courseId: number }) {
  return (
    <DropdownMenuItem className='flex gap-2 text-red-600' onClick={() => delCourse(courseId)}>
      <Trash className='h-5 w-5' /> Delete Course
    </DropdownMenuItem>
  );
}
import { CircleX } from 'lucide-react'
import { setExamState } from '@/utils/course-actions'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export default function SetExamFailed({ examId, state }: { examId: number, state: number }) {
  const setExamFailed = () => {
    if (state != 0) return;
    setExamState({ examId, state: 2 });
  }

  return (
    <DropdownMenuItem className='flex gap-2' onClick={setExamFailed} disabled={state != 0}>
      <CircleX className='h-5 w-5' /> Set Exam as Failed
    </DropdownMenuItem>
  );
}
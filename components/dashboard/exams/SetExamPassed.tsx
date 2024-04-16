import { Check } from 'lucide-react'
import { setExamState } from '@/utils/course-actions'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export default function SetExamPassed({ examId, state }: { examId: number, state: number }) {
  const setExamPassed = () => {
    if (state != 0) return;
    setExamState({ examId, state: 1 });
  }

  return (
    <DropdownMenuItem className='flex gap-2' onClick={setExamPassed} disabled={state != 0}>
      <Check className='h-5 w-5' /> Set Exam as Passed
    </DropdownMenuItem>
  );
}
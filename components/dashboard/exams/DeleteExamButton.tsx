import { Trash2 as Trash } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { deleteExam } from '@/utils/actions'

export default function DeleteExam({ examId }: { examId: number }) {
  return (
    <DropdownMenuItem className='flex gap-2 text-red-600' onClick={() => deleteExam({ examId })}>
      <Trash className='h-5 w-5' /> Delete Exam
    </DropdownMenuItem>
  );
}
import { FilePenLine } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogDescription } from '@/components/ui/dialog'
import ModifyCourseForm from '@/components/dashboard/courses/ModifyCourseForm';

export default function ModifyCourseDialog({ courseId, open, setOpen }: { courseId: number, open: boolean, setOpen: (state: boolean) => void }) {
  const closeDialog = () => {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader className='flex flex-row gap-2 items-center'>
          <FilePenLine className='h-5 w-5' /> Modify Course Data
        </DialogHeader>
        <DialogDescription>You can modify the course data here.</DialogDescription>
        <ModifyCourseForm courseId={courseId} />
      </DialogContent>
    </Dialog>
  );
}
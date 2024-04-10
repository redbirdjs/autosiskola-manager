'use client'

import Link from 'next/link'
import { MoreHorizontal, Clock, Check, CircleX, Clipboard, UserRound, Trash2 as Trash } from 'lucide-react'
import moment from 'moment'
import { ColumnDef } from '@tanstack/react-table'

import DeleteExamButton from '@/components/dashboard/exams/DeleteExamButton'
import SetExamFailed from '@/components/dashboard/exams/SetExamFailed'
import SetExamPassed from '@/components/dashboard/exams/SetExamPassed'
import { Button, buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Exam } from '@/lib/definitions'
import { toast } from '@/components/ui/use-toast'

const copyExamId = (examid: string) => {
  navigator.clipboard.writeText(examid);
  toast({
    title: 'Exam ID copied to clipboard!',
    duration: 2000
  });
}

export const columns: ColumnDef<Exam>[] = [
  {
    accessorKey: 'id',
    header: '# No.',
    cell: ({ row }) => {
      const id = row.getValue<number>('id');
      const formatted = id.toString().padStart(4, '0');

      return <div>#{ formatted }</div>
    }
  },
  {
    accessorKey: 'date',
    header: 'Date of the Exam',
    cell: ({ row }) => {
      const date = row.getValue<Date>('date');
      const formatted = moment(date).format('YYYY-MM-DD HH:mm:ss');

      return <div>{ formatted }</div>
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue<string>('category');
      
      return <div className={buttonVariants({ variant: 'default' })}>{ category }</div>
    }
  },
  {
    accessorKey: 'student',
    header: 'Student',
    cell: ({ row }) => {
      const student = row.getValue<string>('student');
      const formatted = student.split('|')[0];

      return <div>{ formatted }</div>
    }
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'state',
    header: 'State',
    cell: ({ row }) => {
      const state = row.getValue<number>('state');
      let formatted;
      switch (state) {
        case 0: formatted = <p className='flex items-center gap-2 text-orange-600'><Clock className='h-5 w-5' /> Waiting for exam...</p>; break;
        case 1: formatted = <p className='flex items-center gap-2 text-green-600'><Check className='h-5 w-5' /> Passed</p>; break;
        case 2: formatted = <p className='flex items-center gap-2 text-red-600'><CircleX className='h-5 w-5' /> Failed</p>; break;
      }
      
      return <div>{ formatted }</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const exam = row.original;
      const examId = exam.id;
      const username = exam.student.split('|')[1];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} className='w-8 h-8'>
              <span className='sr-only'>Open Menu</span>
              <MoreHorizontal className='min-w-5 min-h-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className='flex gap-2' onClick={() => copyExamId(exam.id.toString())}>
              <Clipboard className='h-5 w-5' /> Copy Exam ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/students/${username}`} className='flex gap-2'><UserRound className='h-5 w-5' /> Go to Student</Link>
            </DropdownMenuItem>
            <SetExamPassed examId={examId} state={exam.state} />
            <SetExamFailed examId={examId} state={exam.state} />
            <DropdownMenuSeparator />
            <DeleteExamButton examId={examId} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
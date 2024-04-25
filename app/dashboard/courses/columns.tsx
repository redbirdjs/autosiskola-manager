'use client'

import Link from 'next/link'
import { MoreHorizontal, Clipboard, Check, Clock, UserRound, BookCheck } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Course, UserNameData } from '@/lib/definitions'
import { toast } from '@/components/ui/use-toast'
import { SetCourseFinished, ModifyCourseData, DeleteCourse } from '@/components/dashboard/courses/CourseActions'

const copyCourseId = (courseId: string) => {
  navigator.clipboard.writeText(courseId);
  toast({
    title: 'Course ID copied to clipboard!',
    duration: 2000
  });
}

export const columns: ColumnDef<Course>[] = [
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
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue<string>('category');

      return <div className='w-max bg-black text-white px-4 py-2 rounded-lg'>{ category }</div>
    }
  },
  {
    accessorKey: 'theory',
    header: 'Theory %',
    cell: ({ row }) => {
      const theory = row.getValue<number>('theory');
      const formatted = theory.toString();

      return <div>{ formatted } %</div>
    }
  },
  {
    accessorKey: 'practise',
    header: 'Practise %',
    cell: ({ row }) => {
      const practise = row.getValue<number>('practise');
      const formatted = practise.toString();

      return <div>{ formatted } %</div>
    }
  },
  {
    accessorKey: 'student',
    header: 'Student\'s Name',
    cell: ({ row }) => {
      const student = row.getValue<UserNameData>('student');

      return <div>{ student.realname }</div>
    }
  },
  {
    accessorKey: 'teacher',
    header: 'Teacher\'s Name',
    cell: ({ row }) => {
      const teacher = row.getValue<UserNameData>('teacher');

      return <div>{ teacher.realname }</div>
    }
  },
  {
    accessorKey: 'vehicle',
    header: 'Vehicle',
    cell: ({ row }) => {
      const vehicle = row.getValue<string | null>('vehicle');
      const formatted = vehicle ? vehicle : 'No vehicle selected.';

      return <div>{ formatted }</div>
    }
  },
  {
    accessorKey: 'finished',
    header: 'State',
    cell: ({ row }) => {
      const state = row.getValue<boolean>('finished');
      const formatted = state ? <div className='flex gap-2 text-green-700'><Check className='h-5 w-5' /> Finished</div> : <div className='flex gap-2 text-orange-600'><Clock className='h-5 w-5' /> Ongoing...</div>

      return formatted;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const course = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} className='h-8 w-8'>
              <span className='sr-only'>Open Menu</span>
              <MoreHorizontal className='min-w-5 min-h-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className='flex gap-2' onClick={() => copyCourseId(course.id.toString())}>
              <Clipboard className='h-5 w-5' /> Copy Course ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/profile/${course.student.username}`} className='flex gap-2'><UserRound className='h-5 w-5' /> Go to Student</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/profile/${course.teacher.username}`} className='flex gap-2'><UserRound className='h-5 w-5' /> Go to Teacher</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SetCourseFinished state={course.finished} courseId={course.id} />
            <ModifyCourseData courseId={course.id} />
            <DeleteCourse courseId={course.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
];
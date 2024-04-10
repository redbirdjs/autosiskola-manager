'use client'

import Link from 'next/link'
import { MoreHorizontal, Clock, Check, Clipboard, CircleAlert, Trash2 as Trash, UserRound } from 'lucide-react'
import moment from 'moment'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export type Payment = {
  id: number;
  name: string;
  description: string;
  student: string;
  issuer: string;
  amount: number;
  state: number;
  created: Date;
  due: Date;
}

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'student',
    header: 'Student',
    cell: ({ row }) => {
      const full = row.getValue<string>('student');
      const name = full.split('|')[0];

      return <div>{ name }</div>
    }
  },
  {
    accessorKey: 'issuer',
    header: 'Issuer'
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);

      return <div className='font-medium'>{formatted}</div>
    }
  },
  {
    accessorKey:'state',
    header: 'State',
    cell: ({ row }) => {
      const state = row.getValue('state');
      const due = row.getValue<Date>('due');
      let formatted;

      if (Date.now() > due.getTime() && state != 1) {
        formatted = <p className='flex items-center gap-2 text-red-600'><CircleAlert className='w-5 h-5' /> Overdue</p>
      } else {
        formatted = state == 0 ? <p className='flex items-center gap-2 text-orange-600'><Clock className='w-5 h-5' /> Pending</p> : <p className='flex items-center gap-2 text-green-700'><Check className='h-5 w-5' /> Paid</p>;
      }

      return <div>{ formatted }</div>
    }
  },
  {
    accessorKey: 'created',
    header: 'Created',
    cell: ({ row }) => {
      const created = row.getValue<Date>('created');
      const formatted = moment(created).format(dateFormat);

      return <div>{ formatted }</div>
    }
  },
  {
    accessorKey: 'due',
    header: 'Due',
    cell: ({ row }) => {
      const due = row.getValue<Date>('due');
      const formatted = moment(due).format(dateFormat);

      return <div>{ formatted }</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;
      const username = payment.student.split('|')[1];

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
            <DropdownMenuItem className='flex gap-2' onClick={() => navigator.clipboard.writeText(payment.id.toString())}>
              <Clipboard className='h-5 w-5' /> Copy Payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/students/${username}`} className='flex gap-2'><UserRound className='h-5 w-5' /> Go to Student</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='flex gap-2' disabled={payment.state == 1}>
              <Check className='w-5 h-5' /> Set as Paid
            </DropdownMenuItem>
            <DropdownMenuItem className='flex gap-2' disabled={payment.state == 0}>
              <Clock className='w-5 h-5' /> Set as Pending
            </DropdownMenuItem>
            <DropdownMenuItem className='flex gap-2 text-red-500'>
              <Trash className='h-5 w-5' /> Delete Payment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
];
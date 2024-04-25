'use client'

import Link from 'next/link'
import { MoreHorizontal, Clock, Check, Clipboard, CircleAlert, UserRound } from 'lucide-react'
import moment from 'moment'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SetPaymentPaid, SetPaymentPending, DeletePayment } from '@/components/dashboard/payments/PaymentActions'
import { Payment } from '@/lib/definitions'
import { toast } from '@/components/ui/use-toast'

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const copyPaymentId = (paymentid: string) => {
  navigator.clipboard.writeText(paymentid);
  toast({
    title: 'Payment ID copied to clipboard!',
    duration: 2000
  });
}

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
      
      if (payment.rank && payment.rank == 'student') return;
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
            <DropdownMenuItem className='flex gap-2' onClick={() => copyPaymentId(payment.id.toString())}>
              <Clipboard className='h-5 w-5' /> Copy Payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/profile/${username}`} className='flex gap-2'><UserRound className='h-5 w-5' /> Go to Student</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SetPaymentPaid paymentId={payment.id} state={payment.state} />
            <SetPaymentPending paymentId={payment.id} state={payment.state} />
            <DropdownMenuSeparator />
            <DeletePayment paymentId={payment.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
];
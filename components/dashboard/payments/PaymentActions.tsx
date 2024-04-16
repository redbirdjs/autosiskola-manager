import { Check, Clock, Trash2 as Trash } from 'lucide-react'
import { setPaymentState, deletePayment } from '@/utils/payment-actions'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function SetPaymentPaid({ paymentId, state }: { paymentId: number, state: number }) {
  return (
    <DropdownMenuItem className='flex gap-2' disabled={state == 1} onClick={() => setPaymentState(paymentId, 1)}>
      <Check className='h-5 w-5' /> Set as Paid
    </DropdownMenuItem>
  );
}

export function SetPaymentPending({ paymentId, state }: { paymentId: number, state: number }) {
  return (
    <DropdownMenuItem className='flex gap-2' disabled={state == 0} onClick={() => setPaymentState(paymentId, 0)}>
      <Clock className='h-5 w-5' /> Set as Pending
    </DropdownMenuItem>
  );
}

export function DeletePayment({ paymentId }: { paymentId: number }) {
  return (
    <DropdownMenuItem className='flex gap-2 text-red-600' onClick={() => deletePayment(paymentId)}>
      <Trash className='h-5 w-5' /> Delete Payment
    </DropdownMenuItem>
  );
}
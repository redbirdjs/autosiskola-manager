import { Payment, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

export default function PaymentsPage() {
  const data: Payment[] = [
    {
      id: 1,
      name: 'Test Payment',
      description: 'Online theory course',
      student: 'Test Student|test_user',
      issuer: 'Test Issuer',
      amount: 10.11,
      state: 0,
      created: new Date(Date.now()-1200000),
      due: new Date(Date.now()+99999999)
    }
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
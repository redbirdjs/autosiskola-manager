import { getPayments } from '@/utils/actions'

import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div>
      <DataTable columns={columns} data={payments} />
    </div>
  );
}
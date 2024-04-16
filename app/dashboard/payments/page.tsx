import { getPayments } from '@/utils/payment-actions'
import { getUserData, logout } from '@/utils/user-actions'

import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

export default async function PaymentsPage() {
  const user = await getUserData();
  if (!user) {
    logout();
    return;
  }
  const payments = await getPayments(user.id, user.rank);

  return (
    <div>
      <DataTable columns={columns} data={payments} />
    </div>
  );
}
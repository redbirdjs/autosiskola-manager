import { Metadata } from 'next'
import { getUserData } from '@/utils/user-actions'

import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'
import NewPaymentSheet from '@/components/dashboard/payments/NewPaymentSheet'

export const metadata: Metadata = {
  title: 'Payments | Dashboard'
}

export default async function PaymentsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserData();

  return (
    <main className='flex flex-col p-5 w-10/12'>
      <div className='flex flex-row justify-between mb-5'>
        <DynamicBreadcrumb />
        { user?.rank.toLowerCase() != 'student' && <NewPaymentSheet /> }
      </div>
      { children }
    </main>
  );
}
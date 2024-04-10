import { Metadata } from 'next'

import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'
import NewExamSheet from '@/components/dashboard/exams/NewExamSheet'

export const metadata: Metadata = {
  title: 'Exams | Dashboard'
}

export default function ExamsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='flex flex-col p-5 w-10/12'>
      <div className='flex flex-row justify-between mb-5'>
        <DynamicBreadcrumb />
        <NewExamSheet />
      </div>
      { children }
    </main>
  );
}
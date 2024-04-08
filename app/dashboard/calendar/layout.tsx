import DynamicBreadcrumb from '@/components/dashboard/DynamicBreadcrumb'

export default function CalendarLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='flex flex-col p-5 w-10/12'>
      <div className='mb-5'>
        <DynamicBreadcrumb />
      </div>
      { children }
    </main>
  );
}
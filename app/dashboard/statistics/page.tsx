import { UserRound, Car, GraduationCap, ReceiptText, School, Library, LineChart } from 'lucide-react'
import { getAdminStatistics } from '@/utils/actions'

import StatCard from '@/components/dashboard/statistics/StatCard'
import { BarChartCard, RadarChartCard, PieChartCard } from '@/components/dashboard/statistics/ChartCards'
import { ChartData } from 'chart.js';

export default async function StatisticsPage() {
  const stats = await getAdminStatistics();

  return (
    <div className='flex flex-col gap-2 w-full h-[700px]'>
      <div className='flex gap-2 flex-wrap w-full'>
        <StatCard title={<><UserRound className='h-8 w-8' /> Users</>} description={stats.userCount} />
        <StatCard title={<><Car className='h-8 w-8' /> Vehicles</>} description={stats.vehicleCount} />
        <StatCard title={<><GraduationCap className='h-8 w-8' /> Active Exams</>} description={stats.examCount} />
        <StatCard title={<><ReceiptText className='h-8 w-8' /> Active Payments</>} description={stats.paymentCount} />
        <StatCard title={<><Library className='h-8 w-8' /> Active Courses</>} description={stats.activeCourses} />
      </div>
      <div className='flex gap-2 justify-between flex-wrap'>
        <PieChartCard title={<><School className='h-8 w-8' /> Passed / Failed Exams</>} data={stats.fpExams} />
        <BarChartCard title={<><ReceiptText className='h-8 w-8' /> Payments</>} data={stats.pResults} />
        <RadarChartCard title={<><LineChart className='h-8 w-8' /> Exams in last 10 days</>} data={stats.categoryResults} />
      </div>
      
    </div>
  );
}
import { BookOpen, UserRound, GraduationCap } from 'lucide-react'

import StatCard from '@/components/dashboard/statistics/StatCard'

export function StudentStats({ stats }: any) {
  console.log(stats);

  return (
    <div>
      <h1 className='text-lg'>Student Statistics</h1>
      <hr className='mb-3' />
      <div className='flex gap-2'>
        <StatCard title={<><GraduationCap className='h-8 w-8' /> Finished Courses</>} description={stats.finishedCourses} />
        <StatCard title={<><GraduationCap className='h-8 w-8' /> Has Active Course</>} description={stats.hasActiveCourse ? 'Yes' : 'No'} />
        {
          stats.hasActiveCourse && (
            <StatCard title={<><GraduationCap className='h-8 w-8' /> Course Progress</>} description={
              <>
                <p>Theory Percentage: {stats.activeStats.theoryPercent} %</p>
                <p>Practise Percentage: {stats.activeStats.practisePercent} %</p>
              </>
            } />
          )
        }
      </div>
    </div>
  );
}

export function TeacherStats({ stats }: any) {
  return (
    <div>
      <h1 className='text-lg'>Teacher Statistics</h1>
      <hr className='mb-3' />
      <div className='flex gap-2'>
        <StatCard title={<><UserRound className='h-8 w-8' /> Students Count</>} description={stats.studentCount} />
        <StatCard title={<><BookOpen className='h-8 w-8' /> Active Courses</>} description={stats.activeCourses} />
      </div>
    </div>
  );
}
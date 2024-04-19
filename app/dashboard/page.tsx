import { redirect } from 'next/navigation'
import { getUserData } from '@/utils/user-actions'

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { CalendarCard, ExamsCard, PaymentsCard, ProfileCard, StatisticsCard, TeacherExamsCard, VehiclesCard } from '@/components/dashboard/MainMenuCards'

export default async function DashboardPage() {
  const user = await getUserData();

  if (!user) return redirect('/');
  const rank = user.rank.toLowerCase();

  return (
    <main className='flex flex-col gap-5 items-center p-5 w-10/12'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Welcome to the Driving School Manager Dashboard!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className='text-base'>Here you can manage all your driving school related administrative tasks.</CardDescription>
        </CardContent>
      </Card>
      <div className='w-full flex flex-row flex-wrap lg:flex-nowrap items-between gap-5'>
        {
          rank == 'student' && (
            <>
              <CalendarCard />
              <ExamsCard />
              <ProfileCard />
            </>
          )
        }
        {
          rank == 'teacher' && (
            <>
              <TeacherExamsCard />
              <PaymentsCard />
              <ProfileCard />
            </>
          )
        }
        {
          rank == 'admin' && (
            <>
              <VehiclesCard />
              <StatisticsCard />
              <ProfileCard />
            </>
          )
        }
      </div>
    </main>
  );
}
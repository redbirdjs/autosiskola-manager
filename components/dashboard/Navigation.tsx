import { BookMarked, CalendarClock, Car, Home, PieChart, School, UserRound, Users, Wallet } from 'lucide-react'
import { getUserData } from '@/utils/user-actions'

import NavButton from '@/components/dashboard/NavigationButton'

export default async function Navigation() {
  const user = await getUserData();
  if (!user) return <></>;
  const rank = user.rank.toLowerCase();

  return (
    <nav className='p-5 w-2/12'>
      <NavButton className='max-lg:justify-center' href={'/dashboard'}><Home className='min-w-7 min-h-7' /> <span className='truncate max-lg:hidden'>Main Menu</span></NavButton>
      { 
        rank == 'student' && (
          <NavButton className='max-lg:justify-center' href={'/dashboard/courses'}><BookMarked className='min-h-7 min-w-7' /> <span className='truncate max-lg:hidden'>Courses</span></NavButton>
        ) 
      }
      {
        rank == 'admin' && (
          <NavButton className='max-lg:justify-center' href={'/dashboard/statistics'}><PieChart className='min-h-7 min-w-7' /> <span className='truncate max-lg:hidden'>Statistics</span></NavButton>
        )
      }
      {
        rank != 'admin' && (
          <NavButton className='max-lg:justify-center' href={'/dashboard/calendar'}><CalendarClock className='min-h-7 min-w-7' /> <span className='truncate max-lg:hidden'>Calendar</span></NavButton>
        )
      }
      {
        rank == 'admin' && (
          <NavButton className='max-lg:justify-center' href={'/dashboard/users'}><Users className='min-h-7 min-w-7' /> <span className='truncate max-lg:hidden'>Users</span></NavButton>
        )
      }
      {
        rank != 'student' && <NavButton className='max-lg:justify-center' href={'/dashboard/students'}><Users className='min-h-7 min-w-7' /> <span className='truncate max-lg:hidden'>Students</span></NavButton>
      }
      {
        rank == 'admin' && (
          <>
            <NavButton className='max-lg:justify-center' href={'/dashboard/teachers'}><Users className='min-h-7 min-w-7' /> <span className='truncate max-lg:hidden'>Teachers</span></NavButton>
            <NavButton className='max-lg:justify-center' href={'/dashboard/vehicles'}><Car className='min-h-7 min-w-7' /> <span className='truncate max-lg:hidden'>Vehicles</span></NavButton>
          </>
        )
      }
      <NavButton className='max-lg:justify-center' href={'/dashboard/exams'}><School className='min-h-7 min-w-7' /> <span className='truncate max-lg:hidden'>Exams</span></NavButton>
      <NavButton className='max-lg:justify-center' href={'/dashboard/payments'}><Wallet className='min-h-7 min-w-7' /> <span className='truncate max-lg:hidden'>Payments</span></NavButton>
      <NavButton className='max-lg:justify-center' href={'/dashboard/profile'}><UserRound className='min-h-7 min-w-7' /> <span className='truncate max-lg:hidden'>Profile</span></NavButton>
    </nav>
  )
}
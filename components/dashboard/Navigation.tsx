import { BookMarked, CalendarClock, Car, Home, PieChart, School, UserRound, Users, UsersRound } from 'lucide-react'

import NavButton from '@/components/dashboard/NavigationButton'

export default function Navigation() {
  return (
    <nav className='border-r border-r-[#eaeaea] p-5 w-2/12'>
      <NavButton href={'/dashboard'}><Home /> Main Menu</NavButton>
      <NavButton href={'/dashboard/courses'}><BookMarked className='h-7 w-7' /> Courses</NavButton>
      <NavButton href={'/dashboard/statistics'}><PieChart className='h-7 w-7' /> Statistics</NavButton>
      <NavButton href={'/dashboard/calendar'}><CalendarClock className='h-7 w-7' /> Calendar</NavButton>
      <NavButton href={'/dashboard/users'}><Users className='h-7 w-7' /> Users</NavButton>
      <NavButton href={'/dashboard/students'}><Users className='h-7 w-7' /> Students</NavButton>
      <NavButton href={'/dashboard/teachers'}><Users className='h-7 w-7' /> Teachers</NavButton>
      <NavButton href={'/dashboard/vehicles'}><Car className='h-7 w-7' /> Vehicles</NavButton>
      <NavButton href={'/dashboard/exams'}><School className='h-7 w-7' /> Exams</NavButton>
      <NavButton href={'/dashboard/payments'}><UsersRound className='h-7 w-7' /> Payments</NavButton>
      <NavButton href={'/dashboard/profile'}><UserRound className='h-7 w-7' /> Profile</NavButton>
    </nav>
  )
}
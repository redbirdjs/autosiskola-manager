import Link from 'next/link'
import { CalendarClock, BarChart2 as BarChart, Warehouse, UserRoundCog, GraduationCap, Banknote, ClipboardPenLine } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

export function CalendarCard() {
  return (
    <Card className='w-full lg:w-1/3'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center mb-1'><CalendarClock /> Calendar</CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <CardDescription className='text-justify'>With the calendar you can easily track all your exams, payments and more.</CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={'/dashboard/calendar'} className={buttonVariants({ variant: 'default' })}>Go to Calendar</Link>
      </CardFooter>
    </Card>
  );
}

export function StatisticsCard() {
  return (
    <Card className='w-full lg:w-1/3'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center mb-1'><BarChart /> Statistics</CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <CardDescription className='text-justify'>
          On the statistics page you can see all the statistics related to the driving school, like registered users, vehicles, active exams and payments. 
          Diagrams for passed and failed exams or payment statuses.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={'/dashboard/statistics'} className={buttonVariants({ variant: 'default' })}>Go to Statistics</Link>
      </CardFooter>
    </Card>
  );
}

export function VehiclesCard() {
  return (
    <Card className='w-full lg:w-1/3'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center mb-1'><Warehouse /> Vehicles</CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <CardDescription className='text-justify'>
          On the vehicles page you can easily manage all the vehicles the driving school has. 
          You can easily add new vehicles to the list, modify vehicle data if something changed or delete the vehicle.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={'/dashboard/vehicles'} className={buttonVariants({ variant: 'default' })}>Go to Vehicles</Link>
      </CardFooter>
    </Card>
  );
}

export function ProfileCard() {
  return (
    <Card className='w-full lg:w-1/3'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center mb-1'><UserRoundCog /> Profile</CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <CardDescription className='text-justify'>
          On the profile page you can see all the important data about your profile. 
          You can also see your profile avatar and also can modify it there. 
          Other than that, you can modify your email address and your password too.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={'/dashboard/profile'} className={buttonVariants({ variant: 'default' })}>Go to Profile</Link>
      </CardFooter>
    </Card>
  );
}

export function ExamsCard() {
  return (
    <Card className='w-full lg:w-1/3'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center mb-1'><GraduationCap /> Exams</CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <CardDescription className='text-justify'>
          On the exams page you can see all your upcoming exams and the results of the exams you have already taken. 
          You can also see some important information about the exams like what category was the exam, the exams short description or the date of the exam.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={'/dashboard/exams'} className={buttonVariants({ variant: 'default' })}>Go to Exams</Link>
      </CardFooter>
    </Card>
  );
}

export function PaymentsCard() {
  return (
    <Card className='w-full lg:w-1/3'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center mb-1'><Banknote /> Payments</CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <CardDescription className='text-justify'>
          On the payments page you can see all your students payments and manage them.
          You can add a new payment to your students, describe what are they going to pay and set a due date.
          You can set the state of the payment to paid or waiting for payment.
          If the payment is still in waiting state after the due date it automatically changes to overdue.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={'/dashboard/payments'} className={buttonVariants({ variant: 'default' })}>Go to Payments</Link>
      </CardFooter>
    </Card>
  );
}

export function TeacherExamsCard() {
  return (
    <Card className='w-full lg:w-1/3'>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center mb-1'><ClipboardPenLine /> Exams</CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <CardDescription className='text-justify'>
          On the exams page you can manage all your students upcoming exams and the exams they already took. 
          You can add a new exam to any of your students, write a small description for the exam and set the date. 
          You can also set the exam state to passed or failed depending on the exam results. 
          There are also some important information about the exams like the category of the exam, the state or the exam date.</CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={'/dashboard/exams'} className={buttonVariants({ variant: 'default' })}>Go to Exams</Link>
      </CardFooter>
    </Card>
  );
}
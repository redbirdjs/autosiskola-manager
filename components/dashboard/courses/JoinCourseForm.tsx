'use client'

import { useFormState } from 'react-dom'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SheetFooter, SheetClose } from '@/components/ui/sheet'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import RequiredStar from '@/components/RequiredStar'
import { CategoryData, TeacherData, VehicleEnrollData } from '@/lib/definitions'

export default function JoinCourseForm({ category, teachers, vehicles }: { category: CategoryData, teachers: TeacherData[], vehicles: VehicleEnrollData[] }) {
  return (
    <form>
      <Input id='courseid' name='courseid' value={category.id}  className='hidden' readOnly />
      <label htmlFor='teacher'>Teacher <RequiredStar /></label>
      <div className='mt-1 mb-3'>
        <Select name='teacher'>
          <SelectTrigger>
            <SelectValue placeholder='Select a teacher...' />
          </SelectTrigger>
          <SelectContent>
            {
              teachers && teachers.map(teacher => (
                <SelectItem key={teacher.id} value={teacher.id.toString()}>{teacher.realName}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      <label htmlFor='vehicle'>Vehicle <RequiredStar /></label>
      <div className='mt-1 mb-3'>
        <Select name='vehicle'>
          <SelectTrigger>
            <SelectValue placeholder='Select a vehicle...' />
          </SelectTrigger>
          <SelectContent>
            {
              vehicles && vehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id.toString()}>{vehicle.brand} {vehicle.type} - {vehicle.driveType}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type='submit'>Enroll</Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
}
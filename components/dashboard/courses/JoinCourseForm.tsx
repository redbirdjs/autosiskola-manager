'use client'

import { useFormState } from 'react-dom'
import { enrollCourse } from '@/utils/actions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SheetFooter, SheetClose } from '@/components/ui/sheet'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import RequiredStar from '@/components/RequiredStar'
import { CategoryData, TeacherData, VehicleEnrollData } from '@/lib/definitions'

export default function JoinCourseForm({ category, studentId, teachers, vehicles }: { category: CategoryData, studentId: number, teachers: TeacherData[], vehicles: VehicleEnrollData[] }) {
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(enrollCourse, initialState);

  return (
    <form action={dispatch}>
      <Input id='categoryId' name='categoryId' value={category.id}  className='hidden' readOnly />
      <Input id='student' name='student' value={studentId} className='hidden' readOnly />
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
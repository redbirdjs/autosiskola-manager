'use client'

import { Plus } from 'lucide-react'
import { useFormState } from 'react-dom'
import clsx from 'clsx'
import { newVehicle } from '@/utils/actions'

import { SheetFooter, SheetClose } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import RequiredStar from '@/components/RequiredStar'

interface CategoryNames {
  id: number,
  category: string
}

export default function NewVehicleForm({ categories }: { categories: CategoryNames[] }) {
  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(newVehicle, initialState);

  return (
    <>
      <form action={dispatch}>
        <label htmlFor='brand'>Brand <RequiredStar /></label>
        <Input id='brand' name='brand' className='mt-1 mb-3' />
        <label htmlFor='type'>Type <RequiredStar /></label>
        <Input id='type' name='type' className='mt-1 mb-2' />
        <label htmlFor='plate'>Plate <RequiredStar /></label>
        <Input id='plate' name='plate' className='mt-1 mb-2' />
        <label htmlFor='category'>Category <RequiredStar /></label>
        <div className='flex flex-row gap-2 mt-1 mb-3'>
          {
            categories.map(category => (
              <div key={category.id} className='w-full'>
                <Input type='radio' name='category' id={`c-${category.id}`} value={category.id.toString()} className={`peer hidden`} />
                <label htmlFor={`c-${category.id}`} className={buttonVariants({ variant: 'outline', className: clsx(`peer-checked:bg-gray-200 w-full`) })}>
                  {category.category}
                </label>
              </div>
            ))
          }
        </div>
        <label htmlFor='color'>Color <RequiredStar /></label>
        <Input id='color' name='color' className='mt-1 mb-3' />
        <label htmlFor='drivetype'>Drive Type</label>
        <Input id='drivetype' name='drivetype' className='mt-1 mb-3' />
        <label htmlFor='car-image'>Preview Image</label>
        <Input id='car-image' name='car-image' type='file' className='mt-1 mb-3' accept='image/png, image/jpeg, image/webp' />
        <SheetFooter className='mb-3'>
          <SheetClose asChild>
            <Button type='submit'><Plus className='h-5 w-5' /> Add new vehicles</Button>
          </SheetClose>
        </SheetFooter>
        <p className='text-gray-500 text-sm'><RequiredStar />: These fields must be filled.</p>
      </form>
    </>
  );
}
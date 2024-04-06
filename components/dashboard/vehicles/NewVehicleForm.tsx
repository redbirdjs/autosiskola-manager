'use client'

import { useRef, useState, ChangeEvent } from 'react'
import Image from 'next/image'
import { Plus, FileX } from 'lucide-react'
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
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File>();

  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(newVehicle, initialState);

  // előnézet módosítás
  const changeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  }

  // kép törlése a mezőből
  const removeImage = () => {
    if (imageRef.current) imageRef.current.value = '';
    setImage(undefined);
  }

  return (
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
      <div className='flex flex-col items-center gap-1 mt-1 mb-3'>
        { image && (
            <Image src={URL.createObjectURL(image)} alt='Preview' width={100} height={100} />
          )
        }
        <div className='w-full flex items-center gap-1'>
          <Input ref={imageRef} onChange={changeImage} id='car-image' name='car-image' type='file' accept='image/png, image/jpeg, image/webp' className='w-full' />
          { image && <Button variant={'destructive'} onClick={removeImage}><FileX className='w-5 h-5' /></Button> }
        </div>
      </div>
      <SheetFooter className='mb-3'>
        <SheetClose asChild>
          <Button type='submit'><Plus className='h-5 w-5' /> Add new vehicle</Button>
        </SheetClose>
      </SheetFooter>
      <p className='text-gray-500 text-sm'><RequiredStar />: These fields must be filled.</p>
    </form>
  );
}
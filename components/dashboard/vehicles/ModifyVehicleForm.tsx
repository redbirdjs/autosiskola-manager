'use client'

import Image from 'next/image'
import { useState, useRef, ChangeEvent } from 'react'
import { useFormState } from 'react-dom'
import clsx from 'clsx'
import { Pen, FileX } from 'lucide-react'
import { modifyVehicle } from '@/utils/actions'

import RequiredStar from '@/components/RequiredStar'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { SheetFooter, SheetClose } from '@/components/ui/sheet'
import { VehicleData, CategoryName } from '@/lib/definitions'

export default function ModifyVehicleForm({ data, categories }: { data: VehicleData, categories: CategoryName[] }) {
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File>();

  const initialState = { message: { title: '' }, errors: {} };
  const [state, dispatch] = useFormState(modifyVehicle, initialState);

  const changeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  }

  const removeImage = () => {
    if (imageRef.current) imageRef.current.value = '';
    setImage(undefined);
  }

  return (
    <form action={dispatch}>
      <Input id='initplate' name='initplate' value={data.plate} className='hidden' readOnly />
      <label htmlFor='brand'>Brand <RequiredStar /></label>
      <Input className='mt-1 mb-3' id='brand' name='brand' defaultValue={data.brand} />
      <label htmlFor='type'>Type <RequiredStar /></label>
      <Input className='mt-1 mb-3' id='type' name='type' defaultValue={data.type} />
      <label htmlFor='plate'>Plate <RequiredStar /></label>
      <Input className='mt-1 mb-3' id='plate' name='plate' defaultValue={data.plate} />
      <label htmlFor='category'>Category <RequiredStar /></label>
      <div className='flex flex-row gap-2 mt-1 mb-3'>
        {
          categories.map(category => (
            <div key={category.id} className='w-full'>
              <Input type='radio' name='category' id={`c-${category.id}`} value={category.id.toString()} className='peer hidden' checked={category.category == data.category} />
              <label htmlFor={`c-${category.id}`} className={buttonVariants({ variant: 'outline', className: clsx(`peer-checked:bg-gray-200 w-full`) })}>
                { category.category }
              </label>
            </div>
          ))
        }
      </div>
      <label htmlFor='color'>Color <RequiredStar /></label>
      <Input className='mt-1 mb-3' id='color' name='color' defaultValue={data.color || ''} />
      <label htmlFor='drivetype'>Drive Type <RequiredStar /></label>
      <Input className='mt-1 mb-3' id='drivetype' name='drivetype' defaultValue={data.drivetype} />
      <label>Preview Image</label>
      <div className='flex flex-col items-center gap-1 mt-1 mb-3'>
        <Image src={image && URL.createObjectURL(image) || data.path} className='border border-gray-300 rounded-lg p-2' alt='Preview' width={100} height={100} />
        <div className='w-full flex items-center gap-1'>
          <Input ref={imageRef} onChange={changeImage} id='car-image' name='car-image' type='file' accept='image/png, image/jpeg, image/webp' className='w-full' />
          { image && <Button variant={'destructive'} onClick={removeImage}><FileX className='w-5 h-5' /></Button> }
        </div>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type='submit' className='flex gap-2'><Pen className='h-4 w-4' /> Modify</Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
}
import { Unplug } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='w-10/12 flex items-center justify-center gap-4'>
      <Unplug className='w-20 h-20' /> 
      <div className='flex flex-col gap-10 items-center justify-center'>
        <h1 className='flex flex-row gap-4 items-center text-6xl'>404</h1>
        <p className='text-lg'>The page you are trying to reach is either not found or does not exist!</p>
      </div>
    </div>
  )
}
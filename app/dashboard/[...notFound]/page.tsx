import { Unplug } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='w-full flex items-center justify-center gap-4'>
      <Unplug className='w-20 h-20' /> 
      <div className='flex flex-col items-center justify-center'>
        <h1 className='flex flex-row gap-4 items-center text-6xl'>404</h1>
        <p className='text-lg'>Ez az oldal nem található vagy még nem áll rendelkezésre!</p>
      </div>
    </div>
  )
}
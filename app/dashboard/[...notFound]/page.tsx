import { Unplug } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='w-10/12 flex items-center justify-center gap-4 min-h-[600px]'>
      <div className='flex'>
        <h1 className='text-xl font-bold pr-3 mr-3 border-r border-r-[#eaeaea]'>404</h1>
        <p>The dashboard page is not found!</p>
      </div>
    </div>
  )
}
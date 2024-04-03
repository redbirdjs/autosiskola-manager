import { badgeVariants } from '../ui/badge'

export function UserCardSkeleton() {
  return (
    <div className='flex flex-row gap-5 border border-[#eaeaea] rounded-lg p-5'>
      <div className='flex space-x-4 animate-pulse'>
        <div className='w-[35px] h-[35px] rounded-full bg-gray-300'></div>
        <div className='flex flex-col gap-1 justify-center'>
          <div className='w-[400px] h-[28px] bg-gray-300 rounded-md'></div>
          <div className='w-[300px] h-[21px] bg-gray-300 rounded-md'></div>
        </div>
        <div className={badgeVariants({ variant: 'outline', className: 'self-center w-[52px] h-[20px] bg-gray-300' })}></div>
      </div>
    </div>
  );
}
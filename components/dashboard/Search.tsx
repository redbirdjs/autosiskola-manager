'use client'

import clsx, { ClassValue } from 'clsx'
import { useDebouncedCallback } from 'use-debounce'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'

export default function SearchField({ className }: { className?: string | ClassValue[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={clsx('relative flex w-1/5', className)}>
      <label htmlFor='searchbar' className='sr-only'>Search</label>
      <Input id='searchbar' placeholder='Search...' onChange={(e) => handleSearch(e.target.value)} defaultValue={searchParams.get('query')?.toString()} className='peer block py-[9px] pl-10 text-base' />
      <Search className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
    </div>
  )
}
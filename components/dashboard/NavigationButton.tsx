'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavigationButton({ href, className, children }: Readonly<{ href: string, className?: string, children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <Link href={href} className={clsx({ 'bg-[#eaeaea]': pathname == href }, className, 'flex flex-row gap-4 items-center mb-3 px-10 py-2 border border-[#eaeaea] hover:bg-[#eaeaea] transition-colors rounded-lg')}>{ children }</Link>
  )
}
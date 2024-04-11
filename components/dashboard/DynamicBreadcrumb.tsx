'use client'

import { Fragment } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Slash } from 'lucide-react'

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbEllipsis, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { capitalizeLetter } from '@/lib/utils'

export default function DynamicBreadcrumb({ className, bcPage }: { className?: string, bcPage?: string }) {
  const path = usePathname();
  const pathItems = path.split('/').slice(1);
  
  const items = pathItems.map((item, index) => {
    item = capitalizeLetter(item);
    if (index === pathItems.length-1) {
      return { title: item }
    } else {
      return { href: `/${pathItems.slice(0, index+1).join('/')}`, title: item }
    }
  });

  return (
    items && (
      <Breadcrumb className={className}>
        <BreadcrumbList>
          { items.map(item => {
                if (item.href) {
                  return (
                    <Fragment key={item.title}>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href={item.href} className='text-base'>{item.title}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>
                        <Slash />
                      </BreadcrumbSeparator>
                    </Fragment>
                  )
                } else {
                  return (
                    <BreadcrumbItem key={item.title}>
                      <BreadcrumbPage className='text-base'>{bcPage || item.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )
                }
            })
          }
        </BreadcrumbList>
      </Breadcrumb>
    )
  );
}
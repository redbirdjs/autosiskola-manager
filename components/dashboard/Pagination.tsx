'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import clsx from 'clsx'

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from '@/components/ui/pagination'

export default function DynamicPagination({ currentPage, pages }: { currentPage: string, pages: number }) {
  // Jelenlegi oldal ahol vagyunk
  const currPage = parseInt(currentPage) || 1;
  // Előre megjelenítendő oldal gombok száma
  const showcount = 3;
  // Gombok legenerálása
  // Csinálunk egy arrayt 3 elemmel és hozzáadunk annyit, hogy mindig középen legyen az éppen aktuális gomb
  const pageArray = Array.from(Array(showcount).keys()).map(x => (currPage > 2) ? x + currPage-2 : x);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      { pages > 1 &&
        <Pagination>
          <PaginationContent>
            { /* Az előző elem gomb csak akkor jelenjen meg, ha nem az első oldalon vagyunk */ }
            {
              currPage != 1 && pages != showcount && (
                <PaginationItem className='cursor-pointer'>
                  <PaginationPrevious onClick={() => setPage(currPage-1)} />
                </PaginationItem>
              )
            }
            {
              pages > showcount && currPage > (pages-2) && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }
            { /* Gombok legenerálása */ }
            {
              pageArray.map((item, index) => {
                if (item <= pages) {
                  if (pages == 1 && item == 0) return;
                  return currPage != pages ? (
                    <PaginationItem key={index+1} onClick={() => setPage(item+1)} className={clsx((item+1) == currPage ? 'cursor-default' : 'cursor-pointer')}>
                      <PaginationLink isActive={(currPage == item+1)}>{item+1}</PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={index} onClick={() => setPage(item)} className={clsx((item) == currPage ? 'cursor-default' : 'cursor-pointer')}>
                      <PaginationLink isActive={(currPage == item)}>{item}</PaginationLink>
                    </PaginationItem>
                  )
                }
              })
            }
            { /* Ha az általunk showcountban megadott oldalszámnál több van akkor megjelenítünk egy ikont hogy jelezzük, több oldal is van */ }
            {
              pages > showcount && currPage < (pages-1) && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }
            { /* A következő elem gomb csak akkor jelenik meg, ha nem az utolsó oldalon vagyunk */ }
            {
              currPage != pages && currPage < pages && pages != showcount && (
                <PaginationItem className='cursor-pointer'>
                  <PaginationNext onClick={() => setPage(currPage+1)} />
                </PaginationItem>
              )
            }
          </PaginationContent>
        </Pagination>
      }
    </>
  );
}
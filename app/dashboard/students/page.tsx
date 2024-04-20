import { SearchX } from 'lucide-react'

import DynamicPagination from '@/components/dashboard/Pagination'
import UserCard from '@/components/dashboard/UserCard'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

import { getFilteredUsers, getUserData } from '@/utils/user-actions'
import { getImageProvider } from '@/lib/utils'

export default async function StudentsPage({ searchParams }: { searchParams: { query: string, page: string } }) {
  const query = searchParams?.query || '';
  const page = searchParams?.page || '1';
  const provider = getImageProvider();

  const loggedUser = await getUserData();
  if (!loggedUser) return <></>;
  const searchResults = await getFilteredUsers({ query, page, rankType: 'student' });

  return (
    <div className='overflow-x-scroll pb-10'>
      {
        searchResults.users.length != 0 ? searchResults.users.map((user) => (
          <UserCard key={user.username} loggedUser={loggedUser.username} user={user} provider={provider} rank={loggedUser.rank} />
        )) : (
          <div className='flex justify-center p-10'>
            <Alert className='w-max'>
              <SearchX className='w-5 h-5' />
              <AlertTitle>No users found!</AlertTitle>
              <AlertDescription>
                No users found for the specified query. Please try another one.
              </AlertDescription>
            </Alert>
          </div>
        )
      }
      <DynamicPagination currentPage={page} pages={searchResults.pages}  />
    </div>
  )
}
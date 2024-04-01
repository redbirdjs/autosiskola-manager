import { SearchX } from 'lucide-react'

import DynamicPagination from '@/components/dashboard/Pagination';
import UserCard from '@/components/dashboard/UserCard'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

import { getUsers } from '@/utils/actions'

export default async function UsersPage({ searchParams }: { searchParams?: { query?: string, page?: string } }) {
  const query = searchParams?.query || '';
  const page = searchParams?.page || '1';

  const searchResults = await getUsers({ query, page });

  return (
    <div>
      {
        searchResults.users.length != 0 ? searchResults.users.map((user) => (
          <UserCard key={user.username} user={user} />
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
  );
}
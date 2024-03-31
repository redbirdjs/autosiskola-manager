import UserCard from '@/components/dashboard/UserCard'

import { getUsers } from '@/utils/actions'

export default async function UsersPage({ searchParams }: { searchParams?: { query?: string, page?: string } }) {
  const query = searchParams?.query || '';
  const page = searchParams?.page || '1';

  const users = await getUsers({ query, page });

  return (
    <>
      {
        users && users.map((user) => (
          <UserCard key={user.username} user={user} />
        ))
      }
    </>
  );
}
import { notFound, redirect } from 'next/navigation';
import { getUserByUsername, getUserData } from '@/utils/actions'

import ProfileLayoutComponent from '@/components/dashboard/profile/ProfileLayout'

export default async function OtherUserPage({ params }: { params: { username: string } }) {
  const own = await getUserData();
  const user = await getUserByUsername(params.username);

  if (own?.username == user?.username) {
    redirect('/dashboard/profile');
  }

  if (!user) {
    notFound();
  }

  return (
    <div>
      <ProfileLayoutComponent user={user} modify={false} />
    </div>
  );
}
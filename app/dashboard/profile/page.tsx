import { redirect } from 'next/navigation'
import { getUserData } from '@/utils/user-actions'

import ProfileLayoutComponent from '@/components/dashboard/profile/ProfileLayout'

export default async function ProfilePage() {
  const user = await getUserData();
  if (!user) return redirect('/');

  return (
    <div>
      <ProfileLayoutComponent user={user} modify={true} />
    </div>
  );
}
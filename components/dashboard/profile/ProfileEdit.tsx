import { getUserData } from '@/utils/user-actions'

import UploadAvatarForm from '@/components/dashboard/profile/UploadAvatar'
import ModifyEmailForm from './ModifyEmail'
import ChangePasswordForm from './ChangePassword'

export default async function ProfileEdit() {
  const user = await getUserData();

  return (
    <div>
      <h1 className='text-xl font-bold'>Edit Profile</h1>
      <hr className='mb-3' />
      <div className='flex gap-2 flex-wrap'>
        <UploadAvatarForm userId={user?.id || 0} />
        <ModifyEmailForm userId={user?.id || 0} />
        <ChangePasswordForm userId={user?.id || 0} />
      </div>
    </div>
  );
}
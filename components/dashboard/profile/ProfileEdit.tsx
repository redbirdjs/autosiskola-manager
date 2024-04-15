import UploadAvatarForm from '@/components/dashboard/profile/UploadAvatar';
import ModifyEmailForm from './ModifyEmail';
import ChangePasswordForm from './ChangePassword';

export default function ProfileEdit() {
  return (
    <div>
      <h1 className='text-xl font-bold'>Edit Profile</h1>
      <hr className='mb-3' />
      <div className='flex gap-2'>
        <UploadAvatarForm />
        <ModifyEmailForm />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
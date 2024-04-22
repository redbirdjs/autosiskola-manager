import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { getImageProvider } from '@/lib/utils'
import { FullUserData } from '@/lib/definitions'
import { getUserStatistics } from '@/utils/stat-actions'
import { TeacherStats, StudentStats } from '@/components/dashboard/profile/StatisticsPages'
import ProfileEdit from './ProfileEdit'

export default async function ProfileLayoutComponent({ user, modify }: { user: FullUserData, modify: boolean }) {
  const stats = await getUserStatistics(user.id, user.rank);
  const provider = getImageProvider();

  return (
    <div className='flex flex-col gap-2 min-h-[600px] flex-wrap'>
      <div className='flex gap-2 flex-wrap md:flex-nowrap'>
        <div className='w-full md:w-auto p-5 border border-[#eaeaea] rounded-lg'>
          <Avatar className='w-full h-full md:w-80 md:h-80 aspect-square'>
            <AvatarImage src={`${provider}${user.avatarPath}`} className='object-cover' />
            <AvatarFallback>
              { user.realname.split(' ').map(x => x[0].toUpperCase()).join('') }
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='border border-[#eaeaea] rounded-lg p-5 w-full text-lg'>
          <div className='flex justify-between'>
            <h1 className='mb-3 text-2xl font-bold'>Profile Details</h1>
          </div>
          <hr className='mb-3' />
          <p className='mb-3'><span className='font-bold'>Username:</span> { user.username }</p>
          <p className='mb-3'><span className='font-bold'>Full name:</span> { user.realname }</p>
          <div className='flex items-center gap-2 mb-3'>
            <p className='font-bold'>Rank:</p>
            <Badge>{ user.rank }</Badge>
          </div>
          <p className='mb-3'><span className='font-bold'>Email address:</span> { user.email }</p>
          { modify && <ProfileEdit /> }
        </div>
      </div>
      {
        user.rank.toLowerCase() != 'admin' && <div className='border border-[#eaeaea] p-5 rounded-lg'>
          {
            stats && user.rank.toLowerCase() == 'teacher' && (
              <TeacherStats stats={stats} />
            )
          }
          {
            stats && user.rank.toLowerCase() == 'student' && (
              <StudentStats stats={stats} />
            )
          }
        </div>
      }
    </div>
  );
}
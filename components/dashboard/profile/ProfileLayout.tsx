import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { getImageProvider } from '@/lib/utils'
import { FullUserData } from '@/lib/definitions'
import { getUserStatistics } from '@/utils/actions'
import { TeacherStats, StudentStats } from '@/components/dashboard/profile/StatisticsPages'

export default async function ProfileLayoutComponent({ user }: { user: FullUserData }) {
  const stats = await getUserStatistics(user.id, user.rank);
  const provider = getImageProvider();

  return (
    <div className='flex flex-col gap-2 min-h-[600px]'>
      <div className='flex gap-2'>
        <div className='p-5 border border-[#eaeaea] rounded-lg'>
          <Avatar className='w-80 h-80'>
            <AvatarImage src={`${provider}${user.avatarPath}`} />
            <AvatarFallback asChild>
              <p>xd</p>
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='border border-[#eaeaea] rounded-lg p-5 w-full text-lg'>
          <h1 className='mb-3 text-2xl font-bold'>Profile Details</h1>
          <hr className='mb-3' />
          <p className='mb-3'><span className='font-bold'>Username:</span> { user.username }</p>
          <p className='mb-3'><span className='font-bold'>Full name:</span> { user.realname }</p>
          <div className='flex items-center gap-2 mb-3'>
            <p className='font-bold'>Rank:</p>
            <Badge>{ user.rank }</Badge>
          </div>
          <p className='mb-3'><span className='font-bold'>Email address:</span> { user.email }</p>
        </div>
      </div>
      <div className='border border-[#eaeaea] p-5 rounded-lg'>
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
    </div>
  );
}
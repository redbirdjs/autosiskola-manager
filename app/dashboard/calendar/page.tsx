import Calendar from '@/components/dashboard/calendar/Calendar'
import { getUserData } from '@/utils/actions'
import { getCalendarEvents } from '@/utils/calendar-actions'

export default async function CalendarPage() {
  const user = await getUserData();
  const events = user && await getCalendarEvents({ email: user.email, rank: user.rank });

  return (
    <div>
      {
        events && <Calendar events={events} />
      }
    </div>
  );
}
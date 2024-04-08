'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { EventSourceInput } from '@fullcalendar/core/index.js'

export default function Calendar({ events }: { events: EventSourceInput }) {
  const header = {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridMonth,dayGrid'
  };

  return (
    <FullCalendar headerToolbar={header} plugins={[ dayGridPlugin ]} initialView='dayGridMonth' events={events} height={700} />
  );
}
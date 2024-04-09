'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { EventSourceInput, ToolbarInput } from '@fullcalendar/core/index.js'

export default function Calendar({ events }: { events: EventSourceInput }) {
  const header: false | ToolbarInput = {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek',
  };

  return (
    <FullCalendar headerToolbar={header} plugins={[ dayGridPlugin ]} initialView='dayGridMonth' events={events} height={700} />
  );
}
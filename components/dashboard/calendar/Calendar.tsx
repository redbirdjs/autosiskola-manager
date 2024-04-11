'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { EventClickArg, EventSourceInput, ToolbarInput } from '@fullcalendar/core/index.js'
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Calendar({ events }: { events: EventSourceInput }) {
  const header: false | ToolbarInput = {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek',
  };

  const viewConfig = {
    dayGrid: {
      dayMaxEventRows: 3
    }
  }

  return (
    <FullCalendar headerToolbar={header} plugins={[ dayGridPlugin ]} dayMaxEventRows={true} views={viewConfig} initialView='dayGridMonth' events={events} height={700} />
  );
}
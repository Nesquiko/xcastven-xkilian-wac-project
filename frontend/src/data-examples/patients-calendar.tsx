import { AppointmentDisplay, ConditionDisplay, PatientsCalendar } from '../api/generated';

export const PatientsCalendarExample: PatientsCalendar = {
  appointments: [
    {
      id: 'appt-0',
      appointmentDateTime: new Date(2025, 3, 4, 10, 0, 0, 0),
      type: "regular_check",
      doctorName: "John Doe",
      patientName: "Kili",
      status: 'scheduled',
    } satisfies AppointmentDisplay,
    {
      id: 'appt-1',
      appointmentDateTime: new Date(2025, 3, 4, 11, 0, 0, 0),
      type: "regular_check",
      doctorName: "John Doe",
      patientName: "Kili",
      status: 'scheduled',
    } satisfies AppointmentDisplay,
    {
      id: 'appt-2',
      appointmentDateTime: new Date(2025, 3, 4, 12, 0, 0, 0),
      type: "regular_check",
      doctorName: "John Doe",
      patientName: "Kili",
      status: 'scheduled',
    } satisfies AppointmentDisplay,
  ] satisfies Array<AppointmentDisplay>,

  conditions: [
    {
      id: 'cond-1',
      name: 'Flu',
      start: new Date(2025, 2, 19, 0, 0, 0, 0),
      end: new Date(2025, 2, 21, 0, 0, 0, 0),
      appointmentsIds: [],
    } satisfies ConditionDisplay,
    {
      id: 'cond-1',
      name: 'Flu',
      start: new Date(2025, 2, 20, 0, 0, 0, 0),
      end: new Date(2025, 2, 26, 0, 0, 0, 0),
      appointmentsIds: [],
    } satisfies ConditionDisplay,
    {
      id: 'cond-1',
      name: 'Flu',
      start: new Date(2025, 2, 28, 0, 0, 0, 0),
      end: new Date(2025, 3, 3, 0, 0, 0, 0),
      appointmentsIds: [],
    } satisfies ConditionDisplay,
  ] satisfies Array<ConditionDisplay>,
} satisfies PatientsCalendar;

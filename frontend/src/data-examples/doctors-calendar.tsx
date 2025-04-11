import { AppointmentDisplay, DoctorCalendar } from '../api/generated';

export const DoctorsCalendarExample: DoctorCalendar = {
  appointments: [
    {
      id: 'appointment-1',
      appointmentDateTime: new Date(2025, 3, 4, 10, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient 1',
      status: 'scheduled',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-2',
      appointmentDateTime: new Date(2025, 3, 4, 11, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient 2',
      status: 'requested',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-3',
      appointmentDateTime: new Date(2025, 3, 4, 12, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient 3',
      status: 'denied',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-4',
      appointmentDateTime: new Date(2025, 3, 11, 10, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient 4',
      status: 'completed',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-5',
      appointmentDateTime: new Date(2025, 3, 11, 10, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient 5',
      status: 'cancelled',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-6',
      appointmentDateTime: new Date(2025, 3, 12, 10, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient 6',
      status: 'scheduled',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-7',
      appointmentDateTime: new Date(2025, 3, 12, 10, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient 7',
      status: 'requested',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-8',
      appointmentDateTime: new Date(2025, 3, 12, 10, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient 8',
      status: 'denied',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-9',
      appointmentDateTime: new Date(2025, 3, 12, 10, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient 9',
      status: 'completed',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-10',
      appointmentDateTime: new Date(2025, 3, 12, 10, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient 10',
      status: 'cancelled',
    } satisfies AppointmentDisplay,
  ] satisfies Array<AppointmentDisplay>,
};

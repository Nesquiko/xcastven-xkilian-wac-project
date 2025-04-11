import {
  AppointmentDisplay,
  ConditionDisplay,
  PatientsCalendar,
  PrescriptionDisplay,
} from '../api/generated';

export const PatientsCalendarExample: PatientsCalendar = {
  appointments: [
    {
      id: 'appointment-1',
      appointmentDateTime: new Date(2025, 3, 4, 10, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient',
      status: 'scheduled',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-2',
      appointmentDateTime: new Date(2025, 3, 4, 11, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient',
      status: 'scheduled',
    } satisfies AppointmentDisplay,
    {
      id: 'appointment-3',
      appointmentDateTime: new Date(2025, 3, 4, 12, 0, 0, 0),
      type: 'regular_check',
      doctorName: 'John Doe',
      patientName: 'Jozef Pacient',
      status: 'scheduled',
    } satisfies AppointmentDisplay,
  ] satisfies Array<AppointmentDisplay>,

  conditions: [
    {
      id: 'condition-1',
      name: 'Flu',
      start: new Date(2025, 2, 19, 0, 0, 0, 0),
      end: new Date(2025, 2, 21, 0, 0, 0, 0),
      appointmentsIds: ['appointment-1'],
    } satisfies ConditionDisplay,
    {
      id: 'condition-2',
      name: 'Migraine',
      start: new Date(2025, 2, 20, 0, 0, 0, 0),
      end: new Date(2025, 2, 26, 0, 0, 0, 0),
      appointmentsIds: ['appointment-2'],
    } satisfies ConditionDisplay,
    {
      id: 'condition-3',
      name: 'Blocked back',
      start: new Date(2025, 2, 28, 0, 0, 0, 0),
      end: new Date(2025, 3, 3, 0, 0, 0, 0),
      appointmentsIds: ['appointment-3'],
    } satisfies ConditionDisplay,
  ] satisfies Array<ConditionDisplay>,

  prescriptions: [
    {
      id: 'prescription-1',
      name: 'Trenbolon',
      start: new Date(2025, 2, 19, 0, 0, 0, 0),
      end: new Date(2025, 2, 26, 0, 0, 0, 0),
      appointmentId: 'appointment-1',
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-2',
      name: 'Stanazol',
      start: new Date(2025, 2, 23, 0, 0, 0, 0),
      end: new Date(2025, 2, 24, 0, 0, 0, 0),
      appointmentId: 'appointment-2',
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-3',
      name: 'Testosterone',
      start: new Date(2025, 2, 25, 0, 0, 0, 0),
      end: new Date(2025, 2, 27, 0, 0, 0, 0),
      appointmentId: 'appointment-3',
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-4',
      name: 'Growth hormone',
      start: new Date(2025, 3, 3, 0, 0, 0, 0),
      end: new Date(2025, 3, 5, 0, 0, 0, 0),
      appointmentId: 'appointment-1',
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-5',
      name: 'Golden dust',
      start: new Date(2025, 3, 3, 0, 0, 0, 0),
      end: new Date(2025, 3, 7, 0, 0, 0, 0),
      appointmentId: 'appointment-2',
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-6',
      name: 'Ibalgin',
      start: new Date(2025, 3, 3, 0, 0, 0, 0),
      end: new Date(2025, 3, 3, 0, 0, 0, 0),
      appointmentId: 'appointment-3',
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-6',
      name: 'Ibalgin',
      start: new Date(2025, 1, 1, 0, 0, 0, 0),
      end: new Date(2025, 1, 20, 0, 0, 0, 0),
      appointmentId: 'appointment-3',
    } satisfies PrescriptionDisplay,
  ] satisfies Array<PrescriptionDisplay>,
} satisfies PatientsCalendar;

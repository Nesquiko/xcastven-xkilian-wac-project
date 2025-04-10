import { AppointmentDisplay, Prescription } from '../api/generated';

export const PrescriptionDetailExample: Prescription = {
  id: 'prescription-detail-1',
  name: 'Trenbolon Acetate',
  start: new Date(2025, 3, 23, 0, 0, 0, 0),
  end: new Date(2025, 3, 26, 0, 0, 0, 0),
  appointmentId: 'appointment-for-prescription-1',
  appointment: {
    id: 'appointment-for-prescription-1',
    appointmentDateTime: new Date(2025, 3, 24, 7, 0, 0, 0),
    doctorName: 'Keiran Smith',
    patientName: 'Kili',
    status: 'scheduled',
    type: 'regular_check',
  } satisfies AppointmentDisplay,
  doctorsNote: 'Patient really needs Trenbolon Acetate',
} satisfies Prescription;

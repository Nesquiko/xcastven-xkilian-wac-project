import {
  ConditionDisplay,
  Doctor,
  PatientAppointment,
  PrescriptionDisplay,
} from '../api/generated';

export const PatientAppointmentDetailExample: PatientAppointment = {
  id: 'patient-appointment-detail-1',
  appointmentDateTime: new Date(2025, 3, 25, 10, 0, 0, 0),
  type: 'regular_check',
  condition: {
    id: 'condition-1',
    name: 'Flu',
    start: new Date(2025, 3, 23, 0, 0, 0, 0),
    end: new Date(2025, 3, 26, 0, 0, 0, 0),
  } satisfies ConditionDisplay,
  status: 'scheduled',
  doctor: {
    id: 'doctor-1',
    email: 'doctor1@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    specialization: 'general_practitioner',
    role: 'doctor',
  } satisfies Doctor,
  prescriptions: [
    {
      id: 'prescription-1',
      name: 'Trenbolon Acetate',
      start: new Date(2025, 3, 23, 0, 0, 0, 0),
      end: new Date(2025, 3, 30, 0, 0, 0, 0),
      appointmentId: 'patient-appointment-detail-1',
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-2',
      name: 'Stanazol',
      start: new Date(2025, 3, 25, 0, 0, 0, 0),
      end: new Date(2025, 3, 26, 0, 0, 0, 0),
      appointmentId: 'patient-appointment-detail-1',
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-3',
      name: 'Growth hormone 500mg',
      start: new Date(2025, 3, 25, 0, 0, 0, 0),
      end: new Date(2025, 3, 29, 0, 0, 0, 0),
      appointmentId: 'patient-appointment-detail-1',
    } satisfies PrescriptionDisplay,
  ] satisfies Array<PrescriptionDisplay>,
} satisfies PatientAppointment;

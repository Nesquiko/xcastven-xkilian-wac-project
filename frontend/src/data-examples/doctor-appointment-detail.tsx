import {
  ConditionDisplay,
  DoctorAppointment,
  Equipment,
  Facility,
  Medicine,
  Patient,
} from '../api/generated';

export const DoctorAppointmentDetailExample: DoctorAppointment = {
  id: 'doctor-appointment-1',
  appointmentDateTime: new Date(2025, 3, 11, 10, 0, 0, 0),
  type: 'regular_check',
  condition: {
    id: 'condition-1',
    name: 'Patients Condition',
    start: new Date(2025, 3, 23, 0, 0, 0, 0),
    end: new Date(2025, 3, 26, 0, 0, 0, 0),
  } satisfies ConditionDisplay,
  status: 'scheduled',
  reason: 'I have a serious headache',
  patient: {
    id: 'patient-1',
    firstName: 'Patient',
    lastName: 'The First',
    email: 'patient@thefirst.sk',
    role: 'patient',
  } satisfies Patient,
  facilities: [] satisfies Array<Facility>,
  equipment: [] satisfies Array<Equipment>,
  medicine: [] satisfies Array<Medicine>,
} satisfies DoctorAppointment;

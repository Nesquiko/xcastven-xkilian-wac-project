import {
  ConditionDisplay,
  DoctorAppointment,
  Equipment,
  Facility,
  Medicine,
  Patient,
  PrescriptionDisplay,
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
  facilities: [{ id: 'facility-1', name: 'Facility 1' }] satisfies Array<Facility>,
  equipment: [{ id: 'equipment-1', name: 'Equipment 1' }] satisfies Array<Equipment>,
  medicine: [{ id: 'medicine-1', name: 'Medicine 1' }] satisfies Array<Medicine>,
  prescriptions: [
    {
      id: 'prescription-1',
      name: 'Stanazol',
      start: new Date(2025, 3, 12, 0, 0, 0, 0),
      end: new Date(2025, 3, 15, 0, 0, 0, 0),
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-2',
      name: 'Trenbolon',
      start: new Date(2025, 3, 11, 0, 0, 0, 0),
      end: new Date(2025, 3, 12, 0, 0, 0, 0),
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-3',
      name: 'Magnesium',
      start: new Date(2025, 3, 9, 0, 0, 0, 0),
      end: new Date(2025, 3, 10, 0, 0, 0, 0),
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-4',
      name: 'Rohypnol',
      start: new Date(2025, 3, 14, 0, 0, 0, 0),
      end: new Date(2025, 3, 18, 0, 0, 0, 0),
    } satisfies PrescriptionDisplay,
    {
      id: 'prescription-5',
      name: 'Coca-Cola',
      start: new Date(2025, 3, 20, 0, 0, 0, 0),
      end: new Date(2025, 3, 21, 0, 0, 0, 0),
    } satisfies PrescriptionDisplay,
  ] satisfies Array<PrescriptionDisplay>,
} satisfies DoctorAppointment;

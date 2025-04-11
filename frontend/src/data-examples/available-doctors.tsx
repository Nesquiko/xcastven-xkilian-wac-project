import { Doctor } from '../api/generated';

export const AvailableDoctorsExample = [
  {
    id: 'doctor-1',
    firstName: 'Jozef',
    lastName: 'Doktorovič',
    email: 'jozef@doktorovic.sk',
    role: 'doctor',
    specialization: 'pediatrician',
  } satisfies Doctor,
  {
    id: 'doctor-2',
    firstName: 'Marián',
    lastName: 'Doktorový',
    email: 'jozef@doktorovic.sk',
    role: 'doctor',
    specialization: 'pediatrician',
  } satisfies Doctor,
  {
    id: 'doctor-3',
    firstName: 'Erik',
    lastName: 'Doktorík',
    email: 'jozef@doktorovic.sk',
    role: 'doctor',
    specialization: 'pediatrician',
  } satisfies Doctor,
  {
    id: 'doctor-4',
    firstName: 'Filip',
    lastName: 'Doktoriak',
    email: 'jozef@doktorovic.sk',
    role: 'doctor',
    specialization: 'pediatrician',
  } satisfies Doctor,
  {
    id: 'doctor-5',
    firstName: 'Elon',
    lastName: 'Doktorusk',
    email: 'jozef@doktorovic.sk',
    role: 'doctor',
    specialization: 'pediatrician',
  } satisfies Doctor,
] satisfies Array<Doctor>;

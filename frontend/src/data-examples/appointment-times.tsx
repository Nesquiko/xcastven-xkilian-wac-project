import { TimeSlot } from '../api/generated';

export const AppointmentTimesExample = [
  { time: '7:00', status: 'available' },
  { time: '8:00', status: 'unavailable' },
  { time: '9:00', status: 'available' },
  { time: '10:00', status: 'available' },
  { time: '11:00', status: 'unavailable' },
  { time: '12:00', status: 'available' },
  { time: '13:00', status: 'unavailable' },
  { time: '14:00', status: 'unavailable' },
] satisfies Array<TimeSlot>;

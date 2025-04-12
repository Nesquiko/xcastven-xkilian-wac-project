import {
  AppointmentStatus,
  AppointmentType,
  DoctorAppointment,
  Equipment,
  Facility,
  Medicine,
  PatientAppointment,
  SpecializationEnum,
} from '../api/generated';
import { h } from '@stencil/core';

export const DAYS_OF_WEEK: Array<{ short: string; long: string }> = [
  { short: 'Mo', long: 'Monday' },
  { short: 'Tu', long: 'Tuesday' },
  { short: 'We', long: 'Wednesday' },
  { short: 'Th', long: 'Thursday' },
  { short: 'Fr', long: 'Friday' },
  { short: 'Sa', long: 'Saturday' },
  { short: 'Su', long: 'Sunday' },
];

export const MONTHS: Array<string> = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const TODAY: Date = new Date();

export const formatDate = (date: Date) => {
  if (!date) return '';
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const formatTime = (date: Date): string => {
  if (!date) return '';

  const hours: string = date.getHours().toString();
  const minutes: string = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const getDateAndTimeTitle = (dateTime: Date, className?: string) => {
  return (
    <h2 class={'text-center text-2xl' + className && ' ' + className}>
      {dateTime && <span class={`text-[#7357be] font-medium`}>{formatDate(dateTime)}</span>}
      {dateTime.getHours() !== null && (
        <span class="text-gray-600">
          {' '}
          at <span class={`text-[#7357be] font-medium`}>{formatTime(dateTime)}</span>
        </span>
      )}
    </h2>
  );
};

export const getSelectedDateTimeObject = (
  date: Date,
  time: string,
): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  date.setHours(hours);
  date.setMinutes(minutes);
  return date;
};

export const formatDateDelta = (startDate: Date, endDate: Date = new Date()) => {
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 'Invalid date';
  }

  if (endDate < startDate) {
    return formatDateDelta(endDate, startDate);
  }

  let years: number = endDate.getFullYear() - startDate.getFullYear();
  let months: number = endDate.getMonth() - startDate.getMonth();
  let days: number = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    const previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += previousMonth.getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  if (years === 0 && months === 0 && days === 0) {
    return 'Less than a day';
  }

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }

  if (days > 0 || (years === 0 && months === 0)) {
    parts.push(`${days + 1} ${days === 1 ? 'day' : 'days'}`);
  }

  if (parts.length === 1) {
    return parts[0];
  } else if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]}`;
  } else {
    return `${parts[0]}, ${parts[1]} and ${parts[2]}`;
  }
};

export const AppointmentStatusColor = {
  requested: {
    background: '#9d83c6',
    foreground: '#000000',
  },
  scheduled: {
    background: '#7357be',
    foreground: '#ffffff',
  },
  completed: {
    background: '#2E8B57',
    foreground: '#ffffff',
  },
  cancelled: {
    background: '#F08080',
    foreground: '#ffffff',
  },
  denied: {
    background: '#4f4f4f',
    foreground: '#000000',
  },
};

export const ConditionOrderColors: Array<string> = [
  '#1976D2',
  '#7B1FA2',
  '#388E3C',
  '#D32F2F',
  '#F57C00',
  '#512DA8',
  '#00796B',
  '#795548',
  '#0097A7',
  '#FBC02D',
];

export const PrescriptionOrderColors: Array<string> = [
  '#FF8080',
  '#FF0000',
  '#800000',
  '#1A0000'
];

const patientButton = (
  displayTitle: string,
  widthClass: string,
  onClick: (appointment: PatientAppointment) => void,
) => {
  return (
    <md-filled-button class={`${widthClass} rounded-full bg-[#7357be]`} onClick={onClick}>
      {displayTitle}
    </md-filled-button>
  );
};

export const getPatientAppointmentActions = (
  appointmentStatus: AppointmentStatus,
  handleRescheduleAppointment: (appointment: PatientAppointment) => void,
  handleCancelAppointment: (appointment: PatientAppointment) => void,
) => {
  switch (appointmentStatus) {
    case 'scheduled':
      return (
        <div class="flex w-full max-w-md flex-row items-center justify-between gap-x-3">
          {patientButton('Re-schedule', 'w-1/2', handleRescheduleAppointment)}
          {patientButton('Cancel', 'w-1/2', handleCancelAppointment)}
        </div>
      );
    case 'requested':
      return (
        <div class="flex w-full max-w-md flex-row items-center justify-between gap-x-3">
          {patientButton('Cancel request', 'w-full', handleCancelAppointment)}
        </div>
      );
    default:
      return null;
  }
};

const doctorButton = (
  displayTitle: string,
  widthClass: string,
  onClick: (
    appointment: PatientAppointment | DoctorAppointment,
    resources?: {
      facilities: Array<Facility>;
      equipment: Array<Equipment>;
      medicine: Array<Medicine>;
    },
  ) => void,
) => {
  return (
    <md-filled-button class={`${widthClass} rounded-full bg-[#7357be]`} onClick={onClick}>
      {displayTitle}
    </md-filled-button>
  );
};

export const getDoctorAppointmentActions = (
  appointmentStatus: AppointmentStatus,
  handleCancelAppointment: (appointment: PatientAppointment | DoctorAppointment) => void,
  handleAcceptAppointment: (appointment: PatientAppointment | DoctorAppointment) => void,
  handleDenyAppointment: (appointment: PatientAppointment | DoctorAppointment) => void,
) => {
  switch (appointmentStatus) {
    case 'scheduled':
      return (
        <div class="flex w-full max-w-md flex-row items-center justify-between gap-x-3">
          {doctorButton('Cancel', 'w-full', handleCancelAppointment)}
        </div>
      );
    case 'requested':
      return (
        <div class="flex w-full max-w-md flex-row items-center justify-between gap-x-3">
          {doctorButton('Accept', 'w-1/2', handleAcceptAppointment)}
          {doctorButton('Deny', 'w-1/2', handleDenyAppointment)}
        </div>
      );
    default:
      return null;
  }
};

export const formatSpecialization = (
  specialization: SpecializationEnum,
) => {
  const withSpaces: string = specialization.replace("_", " ");
  return withSpaces[0].toUpperCase() + withSpaces.slice(1);
};

export const formatAppointmentType = (
  appointmentType: AppointmentType
) => {
  const withSpaces: string = appointmentType.replace("_", " ");
  return withSpaces[0].toUpperCase() + withSpaces.slice(1);
};

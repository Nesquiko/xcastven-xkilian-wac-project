import { h } from "@stencil/core";
import { Appointment, AppointmentStatusEnum, TimeSlot } from '../api/generated';

export const DAYS_OF_WEEK: Array<{ short: string; long: string }> = [
  { short: "Mo", long: "Monday" },
  { short: "Tu", long: "Tuesday" },
  { short: "We", long: "Wednesday" },
  { short: "Th", long: "Thursday" },
  { short: "Fr", long: "Friday" },
  { short: "Sa", long: "Saturday" },
  { short: "Su", long: "Sunday" },
];

export const MONTHS: Array<string> = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const TODAY: Date = new Date();

export const formatDate = (date: Date) => {
  if (!date) return "";
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const getDateAndTimeTitle = (
  date: Date,
  time: string,
  fontWeight: string,
  className?: string,
) => {
  return (
    <h2 class={"text-2xl text-center" + className && " " + className}>
      {date && (
        <span class={"text-[#7357be] font-" + fontWeight}>{formatDate(date)}</span>
      )}
      {time && (
        <span class="text-gray-600"> at <span class={"text-[#7357be] font-" + fontWeight}>{time}</span></span>
      )}
    </h2>
  );
};

export const formatDateDelta = (startDate: Date, endDate: Date = new Date()) => {
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "Invalid date";
  }

  if (endDate < startDate) {
    return formatDateDelta(endDate, startDate);
  }

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

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
    return "Less than a day";
  }

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }

  if (days > 0 || (years === 0 && months === 0)) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
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
  "requested": {
    background: "#9d83c6",
    foreground: "#000000",
  },
  "scheduled": {
    background: "#7357be",
    foreground: "#ffffff",
  },
  "completed": {
    background: "#2E8B57",
    foreground: "#ffffff",
  },
  "canceled": {
    background: "#F08080",
    foreground: "#ffffff",
  },
  "denied": {
    background: "#4f4f4f",
    foreground: "#000000",
  }
};

export const ConditionOrderColors: Array<string> = [
  "#1976D2",
  "#7B1FA2",
  "#388E3C",
  "#D32F2F",
  "#F57C00",
  "#512DA8",
  "#00796B",
  "#795548",
  "#0097A7",
  "#FBC02D",
];

export const getAppointmentActions = (
  appointmentStatus: AppointmentStatusEnum,
  handleRescheduleAppointment: (appointment: Appointment) => void,
  handleCancelAppointment: (appointment: Appointment) => void,
) => {
  const rescheduleButton = (
    displayTitle: string,
    widthClass: string,
  ) => {
    return (
      <md-filled-button
        class={`${widthClass} rounded-full bg-[#7357be]`}
        onClick={handleRescheduleAppointment}
      >
        {displayTitle}
      </md-filled-button>
    )
  };

  const cancelButton = (
    displayTitle: string,
    widthClass: string,
  ) => {
    return (
      <md-filled-button
        class={`${widthClass} rounded-full bg-[#7357be]`}
        onClick={handleCancelAppointment}
      >
        {displayTitle}
      </md-filled-button>
    );
  };

  switch (appointmentStatus) {
    case 'scheduled':
      return (
        <div class="w-full max-w-md flex flex-row justify-between items-center gap-x-3">
          {rescheduleButton("Re-schedule", "w-1/2")}
          {cancelButton("Cancel", "w-1/2")}
        </div>
      );
    case "requested":
      return (
        <div class="w-full max-w-md flex flex-row justify-between items-center gap-x-3">
          {cancelButton("Cancel request", "w-full")}
        </div>
      );
    default:
      return null;
  }
};

export type Condition = {
  id: string;
  displayName: string;
  startDate: Date;
  endDate?: Date;
  ended: boolean;
  appointments: Array<Appointment>;
};

export const HomepagePatientDataExample = {
  appointments: [
    {
      id: 'appt-1',
      timeSlot: {
        time: '7:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 4),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'scheduled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-2',
      timeSlot: {
        time: '8:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 5),
      type: {
        id: '100',
        displayName: 'Consultation',
      },
      doctor: {
        id: '1542523124',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'email@smith.sk',
        specialization: 'general_practitioner',
      },
      illness: 'Flu',
      status: 'requested',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-3',
      timeSlot: {
        time: '11:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 10),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'completed',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-4',
      timeSlot: {
        time: '13:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 14),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'denied',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-5',
      timeSlot: {
        time: '10:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 19),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'canceled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-6',
      timeSlot: {
        time: '10:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 19),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'canceled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-7',
      timeSlot: {
        time: '10:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 19),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'canceled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-8',
      timeSlot: {
        time: '10:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 19),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'canceled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
  ] satisfies Array<Appointment>,
  conditions: [
    {
      id: 'cond-1',
      displayName: 'Flu',
      startDate: new Date(2025, 3, 17),
      endDate: new Date(2025, 3, 17),
      ended: true,
      appointments: [
        {
          id: 'appt-1',
          timeSlot: {
            time: '7:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
        {
          id: 'appt-1',
          timeSlot: {
            time: '9:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '9',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
        {
          id: 'appt-1',
          timeSlot: {
            time: '11:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
        {
          id: 'appt-1',
          timeSlot: {
            time: '11:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
        {
          id: 'appt-1',
          timeSlot: {
            time: '11:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
        {
          id: 'appt-1',
          timeSlot: {
            time: '11:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
      ] satisfies Array<Appointment>,
    },
    {
      id: 'cond-2',
      displayName: 'Broken leg',
      startDate: new Date(2025, 3, 23),
      endDate: new Date(2025, 3, 25),
      ended: true,
      appointments: [],
    },
    {
      id: 'cond-3',
      displayName: 'ACL tear',
      startDate: new Date(2025, 3, 25),
      endDate: new Date(2025, 3, 26),
      ended: true,
      appointments: [],
    },
    {
      id: 'cond-4',
      displayName: 'Migraine',
      startDate: new Date(2025, 3, 24),
      endDate: new Date(2025, 3, 30),
      ended: true,
      appointments: [],
    },
    {
      id: 'cond-5',
      displayName: 'Headache',
      startDate: new Date(2025, 3, 22),
      endDate: new Date(2025, 3, 23),
      ended: true,
      appointments: [],
    },
  ] satisfies Array<Condition>,
};

export const HomepageDoctorDataExample = {
  appointments: [
    {
      id: 'appt-1',
      timeSlot: {
        time: '7:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 9),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'requested',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-2',
      timeSlot: {
        time: '7:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 9),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'requested',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-3',
      timeSlot: {
        time: '7:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 9),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'scheduled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-4',
      timeSlot: {
        time: '7:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 9),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'scheduled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-5',
      timeSlot: {
        time: '7:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(2025, 3, 9),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'scheduled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
  ] satisfies Array<Appointment>,
};

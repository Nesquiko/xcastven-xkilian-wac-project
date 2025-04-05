import { h } from "@stencil/core";
import { Appointment, AppointmentStatusEnum } from '../api/generated';

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

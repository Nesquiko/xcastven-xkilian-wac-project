import { h } from "@stencil/core";

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
  className?: string,
) => {
  return (
    <h2 class={"text-2xl text-center" + className && " " + className}>
      {date && (
        <span class="text-[#7357be] font-bold">{formatDate(date)}</span>
      )}
      {time && (
        <span class="text-gray-600"> at <span class="text-[#7357be] font-bold">{time}</span></span>
      )}
    </h2>
  );
};

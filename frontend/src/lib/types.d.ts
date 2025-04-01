export type Appointment = {
  id: string;
  timeSlot: TimeSlot;
  date: Date;
  type: AppointmentType;
  doctor: Doctor;
  illness: string;
  status: AppointmentStatus;
  reason?: string;
  facilities?: Array<string>;
  equipment?: Array<string>;
  medicine?: Array<string>;
};

export type Illness = {
  id: string;
  displayName: string;
  startDate: Date;
  endDate?: Date;
  ended: boolean;
};

export type TimeSlot = {
  time: string;
  status: "available" | "unavailable";
};

export type AppointmentType = {
  id: string;
  displayName: string;
};

export type Doctor = {
  id: string;
  displayName: string;
  specialty: string;
};

export type AppointmentStatus =
  | "requested"
  | "canceled"
  | "scheduled"
  | "completed"
  | "denied";

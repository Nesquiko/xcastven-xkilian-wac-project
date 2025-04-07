import {
  AppointmentDisplay,
  Condition,
} from '../api/generated';

export const ConditionDetailExample: Condition = {
  id: "condition-detail-1",
  name: "Migraine",
  start: new Date(2025, 3, 20, 0, 0, 0, 0),
  end: new Date(2025, 4, 2, 0, 0, 0, 0),
  appointments: [
    {
      id: "appointment-on-condition-1",
      appointmentDateTime: new Date(2025, 3, 21, 12, 0, 0, 0),
      doctorName: "John Smith",
      patientName: "Kili",
      status: "completed",
      type: "regular_check",
    } satisfies AppointmentDisplay,
  ] satisfies Array<AppointmentDisplay>,
} satisfies Condition;

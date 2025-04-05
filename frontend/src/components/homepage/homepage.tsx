import { Component, h, State } from '@stencil/core';
import { MdMenu } from '@material/web/all';
import { Appointment, AppointmentStatusEnum, TimeSlot } from '../../api/generated';
import {
  AppointmentStatusColor,
  ConditionOrderColors,
  DAYS_OF_WEEK,
  formatDate,
  formatDateDelta,
  getAppointmentActions,
  getDateAndTimeTitle,
  MONTHS,
  TODAY,
} from '../../utils/utils';

type Condition = {
  id: string;
  displayName: string;
  startDate: Date;
  endDate?: Date;
  ended: boolean;
  appointments: Array<Appointment>;
};

const data = {
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
      startDate: new Date(2023, 8, 15),
      endDate: new Date(2023, 9, 5),
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
      startDate: new Date(2025, 3, 20),
      endDate: new Date(2025, 3, 21),
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
      startDate: new Date(2025, 4, 4),
      ended: false,
      appointments: [],
    },
  ] satisfies Array<Condition>,
};

@Component({
  tag: 'xcastven-xkilian-project-home-page',
  shadow: false,
})
export class Homepage {
  @State() appointments: Array<Appointment> = data.appointments;
  @State() conditions: Array<Condition> = data.conditions;
  @State() selectedAppointment: Appointment = null;
  @State() selectedCondition: Condition = null;
  @State() selectedDate: Date = null;
  @State() isDrawerOpen: boolean = false;
  @State() expandedConditionId: string = null;
  @State() hoveredConditionId: string = null;
  @State() activeTab: number = 0;

  @State() currentViewMonth: number = TODAY.getMonth();
  @State() currentViewYear: number = TODAY.getFullYear();

  private handleTabChange = (event) => {
    const tabBar = event.target;
    this.activeTab = tabBar.activeTabIndex;
  };

  private getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  private getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  private getAppointmentTooltipContent = (appointment: Appointment) => {
    const displayStatus: string = appointment.status[0].toUpperCase() + appointment.status.slice(1);
    return displayStatus + " " + appointment.type.displayName + " at " + appointment.timeSlot.time;
  };

  private renderCalendar = () => {
    const year: number = this.currentViewYear;
    const month: number = this.currentViewMonth;
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    const daysInMonth: number = this.getDaysInMonth(year, month);
    const firstDayOfMonth: number = this.getFirstDayOfMonth(year, month);

    const prevMonthDays = [];
    const currentMonthDays = [];
    const nextMonthDays = [];

    const appointmentsByDate = new Map<string, Array<Appointment>>();

    this.appointments.forEach((appointment: Appointment) => {
      const date: Date = appointment.appointmentDate;
      const dateKey: string = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

      if (!appointmentsByDate.has(dateKey)) {
        appointmentsByDate.set(dateKey, []);
      }

      appointmentsByDate.get(dateKey).push(appointment);
    });

    const daysInPrevMonth: number = this.getDaysInMonth(year, month - 1);
    for (let i: number = firstDayOfMonth - 1; i >= 0; i--) {
      prevMonthDays.push(
        <div class="px-3 py-2 text-center text-sm text-gray-400 bg-gray-100 w-full flex items-center justify-center">
          {daysInPrevMonth - i}
        </div>,
      );
    }

    const conditionHeightMap: Record<string, number> = {};
    const conditionColorMap: Record<string, string> = {};
    this.conditions.forEach((condition: Condition, index: number) => {
      conditionColorMap[condition.id] = ConditionOrderColors[index % ConditionOrderColors.length];
    });

    let currentMaxHeight = 0;

    for (let i: number = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      currentDate.setHours(0, 0, 0, 0);

      const dateKey: string = year + "-" + month + "-" + i;
      const appointmentsForDay: Array<Appointment> = appointmentsByDate.get(dateKey) ?? [];

      const isToday: boolean =
        i + 1 === today.getDay() &&
        this.currentViewMonth === today.getMonth() &&
        this.currentViewYear === today.getFullYear();
      const isPastDate: boolean = currentDate < today;

      const conditionsForDate: Array<Condition> = this.getConditionsForDate(currentDate);

      currentMonthDays.push(
        <div
          role="button"
          class={`flex flex-col gap-y-1 text-sm relative w-full items-center justify-center
          ${isPastDate ? 'text-gray-400' : 'hover:border-[#9d83c6] hover:border-2 bg-[#f0eafa]'}
        `}
          onClick={(event: MouseEvent) => {
            event.stopPropagation();
            this.handleSelectDate(currentDate);
          }}
        >
          <span class={`py-1 w-full text-center ${isToday && 'bg-[#7357be] text-white'}`}>{i}</span>

          <div class="relative w-full h-full flex flex-row flex-wrap gap-x-1 items-center justify-center">
            {appointmentsForDay.length > 0 && (
              appointmentsForDay.map((appointment, index: number) => (
                <button
                  key={appointment.id + index}
                  class="circle-container relative group"
                  onClick={(event: MouseEvent) => {
                    event.stopPropagation();
                    this.handleSelectAppointment(appointment);
                  }}
                >
                  <div
                    class={`cursor-pointer circle rounded-full transition-all duration-200
                    w-3 h-3 hover:w-4 hover:h-4
                    sm:w-[0.875rem] sm:h-[0.875rem] sm:hover:w-5 sm:hover:h-5
                    md:w-4 md:h-4 md:hover:w-6 md:hover:h-6
                    lg:w-5 lg:h-5 lg:hover:w-7 lg:hover:h-7
                  `}
                    style={{
                      backgroundColor: AppointmentStatusColor[appointment.status].background,
                    }}
                  ></div>
                  <div
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                    {this.getAppointmentTooltipContent(appointment)}
                  </div>
                </button>
              ))
            )}
          </div>

          {conditionsForDate.map((condition: Condition) => {
            const isStartDate: boolean = currentDate.getTime() === condition.startDate.getTime();
            const isEndDate: boolean = condition.endDate && currentDate.getTime() === condition.endDate.getTime();

            if (!(condition.id in conditionHeightMap)) {
              conditionHeightMap[condition.id] = currentMaxHeight;
              currentMaxHeight += 0;
            }

            const conditionHeight = conditionHeightMap[condition.id] + 10;
            const conditionColor = conditionColorMap[condition.id];

            return (
              <div
                key={condition.id}
                class="absolute left-0 right-0 cursor-pointer transition-all duration-200 group"
                style={{
                  bottom: "0px",
                  height: this.hoveredConditionId === condition.id ? `${conditionHeight + 6}px` : `${conditionHeight}px`,
                  zIndex: (100 - conditionHeight + 10 / 6).toString(),
                  backgroundColor: conditionColor,
                }}
                onMouseEnter={() => (this.hoveredConditionId = condition.id)}
                onMouseLeave={() => (this.hoveredConditionId = null)}
                onClick={(event: MouseEvent) => {
                  event.stopPropagation();
                  this.handleSelectCondition(condition);
                }}
              >
                <div class="relative">
                  {isStartDate && (
                    <div
                      class="absolute left-0 top-0 transform -translate-y-3 w-5 h-5 rounded-tr-full"
                      style={{
                        backgroundColor: conditionColor,
                      }}
                    ></div>
                  )}

                  {isEndDate && (
                    <div
                      class="absolute right-0 top-0 transform -translate-y-3 w-5 h-5 rounded-tl-full"
                      style={{
                        backgroundColor: conditionColor,
                      }}
                    ></div>
                  )}

                  <div
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10"
                  >
                    {condition.displayName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    const totalCells = 42;
    const remainingCells =
      totalCells - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push(
        <div class="px-3 py-2 text-center text-sm text-gray-400 bg-gray-100 w-full flex items-center justify-center">
          {i}
        </div>,
      );
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };


  private getMonthName = () => {
    return MONTHS[this.currentViewMonth];
  };

  private prevMonth = () => {
    if (this.currentViewMonth === 0) {
      this.currentViewMonth = 11;
      this.currentViewYear--;
    } else {
      this.currentViewMonth--;
    }
  };

  private nextMonth = () => {
    if (this.currentViewMonth === 11) {
      this.currentViewMonth = 0;
      this.currentViewYear++;
    } else {
      this.currentViewMonth++;
    }
  };

  private handleYearChange = (event: Event) => {
    this.currentViewYear = parseInt((event.target as HTMLSelectElement).value);
  };

  private handleToggleMenu = () => {
    const menu: MdMenu = document.querySelector('md-menu');
    if (menu) {
      menu.open = !menu.open;
    }
  };

  private handleRescheduleAppointment = () => {
    console.log('Re-schedule appointment:', this.selectedAppointment);
  };

  private handleCancelAppointment = () => {
    console.log('Cancel appointment:', this.selectedAppointment);
  };

  private resetSelection = () => {
    this.isDrawerOpen = false;
    this.selectedAppointment = null;
    this.selectedCondition = null;
    this.selectedDate = null;
  };

  private handleSelectAppointment = (appointment: Appointment) => {
    this.selectedAppointment = appointment;
    this.selectedCondition = null;
    this.selectedDate = null;
    this.isDrawerOpen = true;
  };

  private handleSelectCondition = (condition: Condition) => {
    this.selectedCondition = condition;
    this.selectedAppointment = null;
    this.selectedDate = null;
    this.isDrawerOpen = true;
  };

  private handleSelectDate = (date: Date) => {
    this.selectedDate = date;
    this.selectedAppointment = null;
    this.selectedCondition = null;
    this.isDrawerOpen = true;
  };

  private toggleConditionAppointments = (conditionId: string) => {
    this.expandedConditionId = this.expandedConditionId === conditionId ? null : conditionId;
  };

  private handleScheduleAppointmentFromCondition = () => {
    console.log('Schedule an appointment for condition:', this.selectedCondition);
  };

  private handleToggleConditionStatus = () => {
    this.selectedCondition = {
      ...this.selectedCondition,
      ended: !this.selectedCondition.ended,
      endDate: new Date(),
    };
  };

  private getAppointmentsForDate = (date: Date): Array<Appointment> => {
    return this.appointments.filter((appointment: Appointment) => {
      const appointmentDate: Date = new Date(appointment.appointmentDate);
      return (
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getDate() === date.getDate()
      );
    });
  };

  private getConditionsForDate = (date: Date): Array<Condition> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.conditions.filter((condition: Condition) => {
      const { startDate, endDate } = condition;
      const effectiveEndDate: Date = endDate ? endDate : today;
      return date >= startDate && date <= effectiveEndDate;
    });
  };

  private getAppointmentStatusMessage = (appointmentStatus: AppointmentStatusEnum) => {
    switch (appointmentStatus) {
      case 'requested':
        return 'This appointment is waiting for a reaction from the Doctor\'s office.';
      case 'scheduled':
        return '';
      case 'completed':
        return 'This appointment has already been completed.';
      case 'denied':
        return 'This appointment has been denied by the Doctor\'s office.';
      case 'canceled':
        return 'This appointment has been canceled by you.';
    }
  };

  render() {
    const currentYear: number = TODAY.getFullYear();
    const yearOptions: Array<number> = [];
    for (let i: number = -5; i <= 5; i++) {
      yearOptions.push(currentYear + i);
    }

    return (
      <div class="flex h-screen flex-col w-full overflow-hidden">
        <div class="bg-gray-800 flex items-center px-3 py-1 text-white">
          <span class="relative">
            <md-icon-button
              id="menu-button"
              class="mr-2"
              onClick={this.handleToggleMenu}
            >
              <span class="material-symbols-outlined text-white">menu</span>
            </md-icon-button>

            <md-menu anchor="menu-button">
              <md-menu-item>
                <div
                  slot="headline"
                  class="text-sm w-48 flex flex-row items-center gap-x-2"
                >
                  <span
                    class="material-symbols-outlined"
                    style={{ fontSize: '20px' }}
                  >
                    calendar_month
                  </span>
                  <span>Schedule an appointment</span>
                </div>
              </md-menu-item>
              <md-menu-item>
                <div
                  slot="headline"
                  class="text-sm w-48 flex flex-row items-center gap-x-2"
                >
                  <span
                    class="material-symbols-outlined"
                    style={{ fontSize: '20px' }}
                  >
                    coronavirus
                  </span>
                  <span>Register a condition</span>
                </div>
              </md-menu-item>
            </md-menu>
          </span>

          <div class="flex flex-1 items-center justify-center gap-x-10">
            <md-icon-button
              onClick={() => this.prevMonth()}
              title="Previous month"
            >
              <span class="material-symbols-outlined text-white">
                chevron_left
              </span>
            </md-icon-button>
            <div class="text-center flex items-center w-48 justify-center">
              <span class="font-medium">{this.getMonthName()}</span>
              <span>,</span>
              <select
                class="bg-transparent border-none font-medium"
                onChange={(e: Event) => this.handleYearChange(e)}
              >
                {yearOptions.map((year) => (
                  <option
                    value={year.toString()}
                    selected={year === this.currentViewYear}
                    class="hover:text-white text-black"
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <md-icon-button
              onClick={() => this.nextMonth()}
              title="Next month"
            >
              <span class="material-symbols-outlined text-white">
                chevron_right
              </span>
            </md-icon-button>
          </div>

          <md-icon-button onClick={() => console.log('account clicked')}>
            <span class="material-symbols-outlined text-white">
              account_circle
            </span>
          </md-icon-button>
        </div>

        <div class="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <div class="grid grid-cols-7">
            {DAYS_OF_WEEK.map((day: { short: string, long: string }) => (
              <div class="px-4 py-3 text-center text-sm font-medium text-[#7357be]">
                <span class="inline md:hidden">{day.short}</span>
                <span class="hidden md:inline">{day.long}</span>
              </div>
            ))}
          </div>

          <div
            class="flex-1 grid grid-cols-7 grid-rows-6 border-x border-t border-[#d8c7ed] divide-x divide-y divide-[#d8c7ed]">
            {this.renderCalendar()}
          </div>

          <div class="w-full px-3 py-1 bg-[#d8c7ed] flex flex-row justify-center items-center gap-x-3">
            <md-text-button
              class="text-sm w-56 relative pr-3"
            >
              <span
                class="material-symbols-outlined absolute top-[10px] left-4"
                style={{ fontSize: '20px' }}
              >
                event
              </span>
              <span class="pl-8 text-center">Schedule an appointment</span>
            </md-text-button>

            <md-text-button
              class="text-sm w-56 relative pr-3"
            >
              <span
                class="material-symbols-outlined absolute top-[10px] left-8"
                style={{ fontSize: '20px' }}
              >
                coronavirus
              </span>
              <span class="pl-8 text-center">Register a condition</span>
            </md-text-button>
          </div>
        </div>

        {this.isDrawerOpen && (
          <div
            class="fixed inset-0 bg-black/50 z-40"
            onClick={() => this.resetSelection()}
          />
        )}

        <div
          class={`fixed top-0 right-0 h-full min-w-md max-w-md bg-white shadow-lg transform transition-transform duration-300 z-50 ${
            this.isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div class="p-4 flex flex-col h-full">

            {/* Selected date */}
            {this.selectedDate && (
              <div class="w-full">
                <h2 class="w-full mb-6 text-center text-[#7357be] font-medium text-lg">
                  {formatDate(this.selectedDate)}
                </h2>

                <div class="flex flex-col gap-y-2 w-full justify-center items-center">
                  {/* Tabs */}
                  <div class="w-full max-w-md bg-gray-100 rounded-lg overflow-hidden">
                    <md-tabs
                      class="w-full"
                      onchange={(e) => this.handleTabChange(e)}
                    >
                      <md-primary-tab class="w-1/2 px-4">
                        <span class="w-full">My appointments</span>
                      </md-primary-tab>
                      <md-primary-tab class="w-1/2 px-4">
                        <span class="w-full">My conditions</span>
                      </md-primary-tab>
                    </md-tabs>
                  </div>

                  {/* Appointments Tab Content */}
                  <div
                    class={`w-full max-w-md ${
                      this.activeTab === 0 ? 'block' : 'hidden'
                    }`}
                  >
                    <div class="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                      {this.getAppointmentsForDate(this.selectedDate).length ?
                        this.getAppointmentsForDate(this.selectedDate)
                          .map((appointment: Appointment, index: number) => {
                              return (
                                <div
                                  key={appointment.id}
                                  class={`h-16 px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent hover:border-[#9d83c6] cursor-pointer
                                ${index % 2 === 0 ? ' bg-gray-200 ' : ' bg-white '}
                                ${index === 0 && ' rounded-t-lg '}
                              `}
                                  onClick={() => this.handleSelectAppointment(appointment)}
                                >
                                  <div class="flex flex-row justify-between items-center">
                                    {getDateAndTimeTitle(
                                      appointment.appointmentDate,
                                      appointment.timeSlot.time,
                                      'medium',
                                    )}
                                    <div class="text-sm font-medium text-gray-600">
                                      {appointment.type.displayName}
                                    </div>
                                  </div>
                                  <div class="text-sm font-medium text-gray-600">
                                    Dr. {appointment.doctor.firstName}{' '}
                                    {appointment.doctor.lastName}
                                  </div>
                                </div>
                              );
                            },
                          ) : (
                          <div
                            class={`h-16 px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent text-center bg-gray-200 text-sm font-medium text-gray-600`}
                          >
                            No appointments for this date
                          </div>
                        )}

                      <div class="w-full flex flex-row justify-between items-center h-12">
                        <md-icon-button
                          title="View older appointments"
                          class="m-1"
                          onClick={() => console.log('view older appointments clicked')}
                        >
                      <span class="material-symbols-outlined text-gray-600">
                        arrow_back
                      </span>
                        </md-icon-button>
                        <md-icon-button
                          title="Schedule an appointment"
                          class="m-1 w-20"
                          onClick={() => console.log('schedule an appointment')}
                        >
                      <span class="material-symbols-outlined text-gray-600">
                        calendar_month
                      </span>
                          <span class="material-symbols-outlined text-gray-600">
                        add
                      </span>
                        </md-icon-button>
                        <md-icon-button
                          title="View newer appointments"
                          class="m-1"
                          onClick={() => console.log('view newer appointments clicked')}
                        >
                      <span class="material-symbols-outlined text-gray-600">
                        arrow_forward
                      </span>
                        </md-icon-button>
                      </div>
                    </div>
                  </div>

                  {/* Conditions Tab Content */}
                  <div
                    class={`w-full max-w-md ${
                      this.activeTab === 1 ? 'block' : 'hidden'
                    }`}
                  >
                    <div class="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                      {this.getConditionsForDate(this.selectedDate).length ?
                        this.getConditionsForDate(this.selectedDate)
                          .map((condition: Condition, index: number) => {
                              const isSelected: boolean =
                                this.selectedCondition && condition.id === this.selectedCondition.id;
                              const isExpanded: boolean =
                                this.expandedConditionId && condition.id === this.expandedConditionId;

                              return (
                                <div key={condition.id}>
                                  <div
                                    class={`px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent hover:border-[#9d83c6] cursor-pointer
                                ${index % 2 === 0 ? ' bg-gray-200 ' : ' bg-white '}
                                ${index === 0 && ' rounded-t-lg '}
                                ${isExpanded ? 'h-auto' : 'h-16'}
                              `}
                                    onClick={() => this.handleSelectCondition(condition)}
                                    style={isSelected ? { borderColor: '#7357be' } : {}}
                                  >
                                    <div class="flex flex-row justify-between items-center">
                                      <div class="text-[#7357be] font-medium">
                                        {condition.displayName}
                                      </div>
                                      <div class="flex items-center">
                                        {condition.ended ? (
                                          <span
                                            class="material-symbols-outlined text-gray-500"
                                            style={{ fontSize: '16px' }}
                                          >
                                      check_circle
                                    </span>
                                        ) : (
                                          <span
                                            class="material-symbols-outlined text-gray-500"
                                            style={{ fontSize: '16px' }}
                                          >
                                      pending
                                    </span>
                                        )}
                                      </div>
                                    </div>
                                    <div class="flex flex-row justify-between items-center">
                                <span class="text-sm text-gray-400">
                                  From:
                                  <span class="text-sm font-medium text-gray-600 ml-2">
                                    {formatDate(condition.startDate)}
                                  </span>
                                </span>
                                      {condition.endDate && (
                                        <span class="text-sm text-gray-400">
                                To:
                                <span class="text-sm font-medium text-gray-600 ml-2">
                                  {formatDate(condition.endDate)}
                                </span>
                              </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            },
                          ) : (
                          <div
                            class={`h-16 px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent text-center bg-gray-200 text-sm font-medium text-gray-600`}
                          >
                            No conditions for this date
                          </div>
                        )}

                      <div class="w-full flex flex-row justify-between items-center h-12">
                        <md-icon-button
                          title="View older conditions"
                          class="m-1"
                          onClick={() => console.log('view older conditions clicked')}
                        >
                          <span class="material-symbols-outlined text-gray-600">
                            arrow_back
                          </span>
                        </md-icon-button>
                        <md-icon-button
                          title="Register a condition"
                          class="m-1 w-20"
                          onClick={() => console.log('register a condition')}
                        >
                          <span class="material-symbols-outlined text-gray-600">
                            coronavirus
                          </span>
                          <span class="material-symbols-outlined text-gray-600">
                        add
                      </span>
                        </md-icon-button>
                        <md-icon-button
                          title="View newer conditions"
                          class="m-1"
                          onClick={() => console.log('view newer conditions clicked')}
                        >
                          <span class="material-symbols-outlined text-gray-600">
                            arrow_forward
                          </span>
                        </md-icon-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected appointment */}
            {this.selectedAppointment && (
              <div class="w-full max-w-md">
                <div class="relative w-full max-w-md">
                  <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-0">
                    <md-icon-button onClick={this.resetSelection}>
                        <span class="material-symbols-outlined text-gray-600">
                          arrow_forward
                        </span>
                    </md-icon-button>
                  </div>

                  <h2 class="w-full text-center text-[#7357be] text-xl font-medium mb-6">
                    Appointment details
                  </h2>
                </div>

                <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
                  <div class="w-full flex flex-row justify-between items-center mb-1">
                    <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          calendar_month
                        </span>
                      Date
                    </div>
                    <span class="font-medium text-gray-600">
                        {formatDate(this.selectedAppointment.appointmentDate)}
                      </span>
                  </div>

                  <div class="w-full flex flex-row justify-between items-center mb-1">
                    <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          schedule
                        </span>
                      Time
                    </div>
                    <span class="font-medium text-gray-600">
                        {this.selectedAppointment.timeSlot.time}
                      </span>
                  </div>

                  <div class="w-full flex flex-row justify-between items-center mb-1">
                    <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          format_list_bulleted
                        </span>
                      Type
                    </div>
                    <span class="font-medium text-gray-600">
                        {this.selectedAppointment.type.displayName}
                      </span>
                  </div>

                  <div class="w-full flex flex-row justify-between items-center">
                    <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          person
                        </span>
                      Doctor
                    </div>
                    <span class="font-medium text-gray-600">
                        Dr. {this.selectedAppointment.doctor.firstName}{' '}
                      {this.selectedAppointment.doctor.lastName}
                      </span>
                  </div>

                  <div class="w-full flex flex-row justify-between items-center">
                    <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          info
                        </span>
                      Status
                    </div>
                    <span class="font-medium text-gray-600">
                        {this.selectedAppointment.status[0].toUpperCase() + this.selectedAppointment.status.slice(1)}
                      </span>
                  </div>
                </div>

                <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6 overflow-y-auto max-h-32">
                  <div class="text-gray-500 flex flex-row items-center gap-x-2 mb-1">
                      <span
                        class="material-symbols-outlined"
                        style={{ fontSize: '16px' }}
                      >
                        description
                      </span>
                    Reason
                  </div>
                  <p class="text-sm font-medium text-gray-600 text-wrap ml-1">
                    {this.selectedAppointment.reason}
                  </p>
                </div>

                {this.selectedAppointment.status !== 'scheduled' && (
                  <p class="text-sm text-gray-600 text-wrap mb-6 text-center">
                    {this.getAppointmentStatusMessage(this.selectedAppointment.status)}
                  </p>
                )}

                {getAppointmentActions(
                  this.selectedAppointment.status,
                  this.handleRescheduleAppointment,
                  this.handleCancelAppointment,
                )}
              </div>
            )}

            {/* Selected condition */}
            {this.selectedCondition && (
              <div class="w-full max-w-md">
                <div class="relative w-full max-w-md">
                  <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-0">
                    <md-icon-button onClick={this.resetSelection}>
                        <span class="material-symbols-outlined text-gray-600">
                          arrow_forward
                        </span>
                    </md-icon-button>
                  </div>

                  <h2 class="w-full text-center text-[#7357be] text-xl font-medium mb-6">
                    Condition details
                  </h2>
                </div>

                <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
                  <div class="w-full flex flex-row justify-between items-center mb-1">
                    <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          edit
                        </span>
                      Name
                    </div>
                    <span class="font-medium text-gray-600">
                        {this.selectedCondition.displayName}
                      </span>
                  </div>

                  <div class="w-full flex flex-row justify-between items-center mb-1">
                    <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          line_start_circle
                        </span>
                      From
                    </div>
                    <span class="font-medium text-gray-600">
                        {formatDate(this.selectedCondition.startDate)}
                      </span>
                  </div>

                  {this.selectedCondition.ended &&
                    this.selectedCondition.endDate && (
                      <>
                        <div class="w-full flex flex-row justify-between items-center mb-1">
                          <div class="text-gray-500 flex flex-row items-center gap-x-2">
                              <span
                                class="material-symbols-outlined"
                                style={{ fontSize: '16px' }}
                              >
                                line_end_circle
                              </span>
                            To
                          </div>
                          <span class="font-medium text-gray-600">
                              {formatDate(this.selectedCondition.endDate)}
                            </span>
                        </div>

                        <div class="w-full flex flex-row justify-between items-center mb-1">
                          <div class="text-gray-500 flex flex-row items-center gap-x-2">
                              <span
                                class="material-symbols-outlined"
                                style={{ fontSize: '16px' }}
                              >
                                timer
                              </span>
                            Duration
                          </div>
                          <span class="font-medium text-gray-600">
                              {formatDateDelta(
                                this.selectedCondition.startDate,
                                this.selectedCondition.endDate,
                              )}
                            </span>
                        </div>
                      </>
                    )}

                  <div class="w-full flex flex-row justify-between items-center">
                    <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          {this.selectedCondition.ended
                            ? 'check_circle'
                            : 'pending'}
                        </span>
                      Status
                    </div>
                    <span class="font-medium text-gray-600">
                        {this.selectedCondition.ended ? 'Gone' : 'Ongoing'}
                      </span>
                  </div>
                </div>

                <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
                  <div class="flex flex-row justify-between items-center mb-2">
                    <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          calendar_month
                        </span>
                      Appointments
                    </div>
                    {this.selectedCondition.appointments.length > 0 && (
                      <md-icon-button
                        onClick={() =>
                          this.toggleConditionAppointments(this.selectedCondition.id)
                        }
                        style={{ width: '24px', height: '24px' }}
                      >
                        <span class="material-symbols-outlined">
                          {this.expandedConditionId === this.selectedCondition.id
                            ? 'expand_less'
                            : 'expand_more'}
                        </span>
                      </md-icon-button>
                    )}
                  </div>

                  {this.selectedCondition.appointments.length <= 0 ? (
                    <div class="text-sm font-medium text-gray-600">
                      No appointments for this condition
                    </div>
                  ) : this.expandedConditionId === this.selectedCondition.id ? (
                    <div class="w-full rounded-md bg-gray-200 overflow-y-auto max-h-28">
                      {this.selectedCondition.appointments.map(
                        (appointment: Appointment) => (
                          <div
                            key={appointment.id}
                            class="flex justify-between items-center py-1 px-2 hover:bg-gray-300 rounded cursor-pointer mb-1"
                            onClick={() =>
                              this.handleSelectAppointment(appointment)
                            }
                          >
                            <div class="flex items-center">
                                <span
                                  class="material-symbols-outlined text-gray-500 mr-2"
                                  style={{ fontSize: '14px' }}
                                >
                                  calendar_month
                                </span>
                              {getDateAndTimeTitle(appointment.appointmentDate, appointment.timeSlot.time, "medium", "text-sm")}
                            </div>
                            <div class="text-xs text-gray-600 font-medium">
                              {appointment.type.displayName}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div class="text-sm font-medium text-gray-600 ml-2">
                      {this.selectedCondition.appointments.length} appointment
                      {this.selectedCondition.appointments.length !== 1 &&
                        's'}
                    </div>
                  )}
                </div>

                <div class="w-full max-w-md flex flex-row justify-between items-center gap-x-3">
                  <md-filled-button
                    class="w-1/2 rounded-full bg-[#7357be]"
                    onClick={this.handleScheduleAppointmentFromCondition}
                  >
                    Schedule
                  </md-filled-button>

                  <md-filled-button
                    class="w-1/2 rounded-full bg-[#7357be]"
                    onClick={this.handleToggleConditionStatus}
                  >
                    {this.selectedCondition.ended ? 'Reset as ongoing' : 'Set as gone'}
                  </md-filled-button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
}


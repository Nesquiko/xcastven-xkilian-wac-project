import { Component, h, State } from '@stencil/core';
import { MdMenu } from '@material/web/all';
import { Appointment, TimeSlot } from '../../api/generated';
import { AppointmentStatusColor, DAYS_OF_WEEK, formatDate, MONTHS, TODAY } from '../../utils/utils';

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
      id: 'appt--1',
      timeSlot: {
        time: '7:00',
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
      id: 'appt-0',
      timeSlot: {
        time: '7:00',
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
      startDate: new Date(2025, 4, 2),
      endDate: new Date(2025, 4, 3),
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
      startDate: new Date(2025, 3, 27),
      endDate: new Date(2025, 3, 28),
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
  @State() isDrawerOpen: boolean = false;

  @State() currentViewMonth: number = TODAY.getMonth();
  @State() currentViewYear: number = TODAY.getFullYear();

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

    data.appointments.forEach(appointment => {
      const date: Date = appointment.appointmentDate;
      const dateKey: string = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

      if (!appointmentsByDate.has(dateKey)) {
        appointmentsByDate.set(dateKey, []);
      }

      appointmentsByDate.get(dateKey).push(appointment);
    });

    const daysInPrevMonth: number = this.getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      prevMonthDays.unshift(
        <div class="px-3 py-2 text-center text-sm text-gray-400 h-20">
          {daysInPrevMonth - i}
        </div>,
      );
    }

    for (let i: number = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      currentDate.setHours(0, 0, 0, 0);

      const dateKey: string = year + "-" + month + "-" + i;
      const appointmentsForDay: Array<Appointment> = appointmentsByDate.get(dateKey) ?? [];

      const isToday: boolean =
        currentDate.getTime() === today.getTime();
      const isSelected: boolean = false;
      const isPastDate: boolean = currentDate < today;

      currentMonthDays.push(
        <div
          class={`px-3 py-2 flex flex-col gap-y-1 text-sm h-20 relative
            ${isSelected ? 'bg-[#7357be] text-white' : ''}
            ${isPastDate
                ? 'text-gray-400'
                : 'hover:border-[#9d83c6] hover:border-2 bg-[#f8f5ff]'
              }
            ${isToday ? ' bg-[#9d83c6] ' : ''}
          `}
        >
          <span class="w-full text-center">{i}</span>

          <div class="relative w-full h-full flex flex-row flex-wrap gap-x-1 items-center justify-center">
            {appointmentsForDay.length > 0 && (
              appointmentsForDay.map((appointment, index: number) => (
                <button
                  key={appointment.id + index}
                  class="circle-container relative group"
                  onClick={() => this.openDrawer(appointment)}
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
        </div>,
      );
    }

    const totalCells = 42;
    const remainingCells =
      totalCells - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push(
        <div class="px-3 py-2 text-center text-sm text-gray-400 h-20">
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

  private showDetailsPanel = () => {
    return this.selectedAppointment !== null || this.selectedCondition !== null;
  };

  private handleToggleMenu = () => {
    const menu: MdMenu = document.querySelector('md-menu');
    if (menu) {
      menu.open = !menu.open;
    }
  };

  private openDrawer(appointment: Appointment) {
    this.selectedAppointment = appointment;
    this.isDrawerOpen = true;
  };

  private closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedAppointment = null;
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
  };

  render() {
    const currentYear: number = TODAY.getFullYear();
    const yearOptions: Array<number> = [];
    for (let i: number = -5; i <= 5; i++) {
      yearOptions.push(currentYear + i);
    }

    return (
      <div class="flex h-screen flex-col w-full flex-1 overflow-x-hidden">
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
                  <span>Register an illness</span>
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

        <div>
          <div class="grid grid-cols-7">
            {DAYS_OF_WEEK.map((day: { short: string, long: string }) => (
              <div class="px-4 py-3 text-center text-sm font-medium text-[#7357be]">
                <span class="inline md:hidden">{day.short}</span>
                <span class="hidden md:inline">{day.long}</span>
              </div>
            ))}
          </div>

          <div class="grid grid-cols-7 border-x border-t border-[#d8c7ed] divide-x divide-y divide-[#d8c7ed]">
            {this.renderCalendar()}
          </div>

          {this.isDrawerOpen && (
            <div
              class="fixed inset-0 bg-black/50 z-40"
              onClick={() => this.closeDrawer()}
            ></div>
          )}

          <div
            class={`fixed top-0 right-0 h-full min-w-md max-w-md bg-white shadow-lg transform transition-transform duration-300 z-50 ${
              this.isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div class="p-4 flex flex-col h-full">
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

                  <div class="w-full max-w-md flex flex-row justify-between items-center gap-x-3">
                    <md-filled-button
                      class="w-1/2 rounded-full bg-[#7357be]"
                      onClick={this.handleRescheduleAppointment}
                    >
                      Re-schedule
                    </md-filled-button>

                    <md-filled-button
                      class="w-1/2 rounded-full bg-[#7357be]"
                      onClick={this.handleCancelAppointment}
                    >
                      Cancel
                    </md-filled-button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


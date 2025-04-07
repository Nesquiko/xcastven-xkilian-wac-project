import { Component, h, State } from '@stencil/core';
import { Appointment } from '../../api/generated';
import {
  AppointmentStatusColor,
  Condition,
  ConditionOrderColors,
  DAYS_OF_WEEK,
  formatDate,
  HomepagePatientDataExample,
  TODAY,
} from '../../utils/utils';

@Component({
  tag: 'xcastven-xkilian-project-home-page',
  shadow: false,
})
export class Homepage {
  @State() appointments: Array<Appointment> = HomepagePatientDataExample.appointments;
  @State() conditions: Array<Condition> = HomepagePatientDataExample.conditions;
  @State() selectedAppointment: Appointment = null;
  @State() selectedCondition: Condition = null;
  @State() selectedDate: Date = null;
  @State() isDrawerOpen: boolean = false;
  @State() hoveredConditionId: string = null;

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

    return (
      <div
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10"
      >
        <link href="./build/xcastven-xkilian-project.css" rel="stylesheet" />
        <div class="flex flex-col gap-y-1 w-full">
          <span class="w-full text-center">{appointment.type.displayName}</span>

          <div class="flex flex-col gap-y-1 items-center justify-center">
            <div class="space-x-1 flex items-center text-gray-400">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                event
              </span>
              <div>{formatDate(appointment.appointmentDate)}</div>
            </div>

            <div class="space-x-1 flex items-center text-gray-400">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                timer
              </span>
              <div>{appointment.timeSlot.time}</div>
            </div>

            <div class="space-x-1 flex items-center text-gray-400">
                <span
                  class="material-symbols-outlined"
                  style={{ fontSize: '16px' }}
                >
                  format_list_bulleted
                </span>
              <div>{displayStatus}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  private getConditionTooltipContent = (condition: Condition) => {
    return (
      <div
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10"
      >
        <div class="flex flex-col gap-y-1 w-full">
          <span class="w-full text-center">{condition.displayName}</span>

          <div class="flex flex-col gap-y-1 items-center justify-center">
            <div class="space-x-1 flex items-center text-gray-400">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                line_start_circle
              </span>
              <div>{formatDate(condition.startDate)}</div>
            </div>

            {condition.endDate && (
              <div class="space-x-1 flex items-center text-gray-400">
                <span
                  class="material-symbols-outlined"
                  style={{ fontSize: '16px' }}
                >
                  line_end_circle
                </span>
                <div>{formatDate(condition.endDate)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
      const dateKey: string = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

      if (!appointmentsByDate.has(dateKey)) {
        appointmentsByDate.set(dateKey, []);
      }

      appointmentsByDate.get(dateKey).push(appointment);
    });

    const daysInPrevMonth: number = this.getDaysInMonth(year, month - 1);
    for (let i: number = firstDayOfMonth - 1; i >= 0; i--) {
      prevMonthDays.push(
        <div class="px-3 py-2 text-center text-sm text-gray-400 bg-gray-200 w-full flex items-center justify-center">
          {daysInPrevMonth - i}
        </div>
      );
    }

    const conditionColorMap: Record<string, string> = {};
    this.conditions.forEach((condition: Condition, index: number) => {
      conditionColorMap[condition.id] = ConditionOrderColors[index % ConditionOrderColors.length];
    });

    const calculateConditionHeights = () => {
      const sortedConditions: Array<Condition> = [...this.conditions]
        .sort((a: Condition, b: Condition): number =>
          a.startDate.getTime() - b.startDate.getTime()
        );

      const timeline: Map<number, Set<string>> = new Map();

      sortedConditions.forEach((condition: Condition) => {
        const startTime: number = condition.startDate.getTime();
        const endTime: number = condition.endDate ? condition.endDate.getTime() : startTime;

        let currentDate: Date = new Date(startTime);
        currentDate.setHours(0, 0, 0, 0);

        while (currentDate.getTime() <= endTime) {
          const timeKey: number = currentDate.getTime();

          if (!timeline.has(timeKey)) {
            timeline.set(timeKey, new Set());
          }

          timeline.get(timeKey).add(condition.id);

          currentDate.setDate(currentDate.getDate() + 1);
        }
      });

      const overlaps: Map<string, Set<string>> = new Map();

      sortedConditions.forEach((condition: Condition) => {
        overlaps.set(condition.id, new Set());
      });

      Array.from(timeline.values()).forEach(activeConditions => {
        if (activeConditions.size > 1) {
          const activeArray: Array<string> = Array.from(activeConditions);
          for (let i = 0; i < activeArray.length; i++) {
            for (let j = i + 1; j < activeArray.length; j++) {
              overlaps.get(activeArray[i]).add(activeArray[j]);
              overlaps.get(activeArray[j]).add(activeArray[i]);
            }
          }
        }
      });

      const conditionHeightMap: Record<string, number> = {};

      sortedConditions.forEach(condition => {
        const usedHeights = new Set<number>();
        overlaps.get(condition.id).forEach(overlapId => {
          if (conditionHeightMap[overlapId] !== undefined) {
            usedHeights.add(conditionHeightMap[overlapId]);
          }
        });

        let heightLevel: number = 0;
        while (usedHeights.has(10 + heightLevel * 6)) {
          heightLevel++;
        }

        conditionHeightMap[condition.id] = 10 + heightLevel * 6;
      });

      return conditionHeightMap;
    };

    const conditionHeightMap: Record<string, number> = calculateConditionHeights();

    for (let i: number = 1; i <= daysInMonth; i++) {
      const currentDate: Date = new Date(year, month, i);
      currentDate.setHours(0, 0, 0, 0);

      const dateKey: string = year + "-" + month + "-" + i;
      const appointmentsForDay: Array<Appointment> = appointmentsByDate.get(dateKey) ?? [];

      const isToday: boolean =
        i === today.getDate() &&
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
                  {this.getAppointmentTooltipContent(appointment)}
                </button>
              ))
            )}
          </div>

          {conditionsForDate.map((condition: Condition) => {
            const isStartDate: boolean = currentDate.getTime() === condition.startDate.getTime();
            const isEndDate: boolean = condition.endDate && currentDate.getTime() === condition.endDate.getTime();

            const conditionHeight: number = conditionHeightMap[condition.id];
            const conditionColor: string = conditionColorMap[condition.id];

            return (
              <div
                key={condition.id}
                class="absolute left-0 right-0 cursor-pointer transition-all duration-200 group"
                style={{
                  bottom: "0px",
                  height: this.hoveredConditionId === condition.id ? `${conditionHeight + 6}px` : `${conditionHeight}px`,
                  zIndex: (50 - conditionHeight).toString(),
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

                  {this.getConditionTooltipContent(condition)}
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
        <div class="px-3 py-2 text-center text-sm text-gray-400 bg-gray-200 w-full flex items-center justify-center">
          {i}
        </div>,
      );
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  private handlePreviousMonth = () => {
    if (this.currentViewMonth === 0) {
      this.currentViewMonth = 11;
      this.currentViewYear--;
    } else {
      this.currentViewMonth--;
    }
  };

  private handleNextMonth = () => {
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

  private handleToggleLegendMenu = () => {
    this.selectedDate = null;
    this.selectedAppointment = null;
    this.selectedCondition = null;
    this.isDrawerOpen = true;
  };

  private handleRescheduleAppointment = () => {
    console.log('Re-schedule appointment:', this.selectedAppointment);
  };

  private handleCancelAppointment = () => {
    console.log('Cancel appointment:', this.selectedAppointment);
  };

  private handleResetSelection = () => {
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

  render() {
    return (
      <div class="flex h-screen flex-col w-full overflow-hidden">
        <xcastven-xkilian-project-header
          currentViewMonth={this.currentViewMonth}
          currentViewYear={this.currentViewYear}
          handlePreviousMonth={this.handlePreviousMonth}
          handleNextMonth={this.handleNextMonth}
          handleYearChange={this.handleYearChange}
        />

        <div class="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <div class="grid grid-cols-7 bg-[#d8c7ed]">
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

          <div class="w-full px-3 py-1 bg-[#d8c7ed] flex flex-row justify-between">
            <div class="w-10"></div>

            <div class="w-full flex flex-row justify-center items-center gap-x-3">
              <md-text-button
                class="text-sm sm:w-56 w-18 relative pr-3 text-[#7357be]"
                onClick={() => console.log("Schedule an appointment")}
                title="Schedule an appointment"
              >
                <span
                  class="material-symbols-outlined absolute top-[10px] left-4"
                  style={{ fontSize: '20px' }}
                >
                  event
                </span>
                <span
                  class="sm:text-transparent material-symbols-outlined absolute top-[10px] left-10"
                  style={{ fontSize: '20px' }}
                >
                  add
                </span>
                <span class="pl-8 text-center sm:inline hidden">Schedule an appointment</span>
              </md-text-button>

              <md-text-button
                class="text-sm sm:w-48 w-18 relative pr-3 text-[#7357be]"
                onClick={() => console.log("Register a condition")}
                title="Register a condition"
              >
                <span
                  class="material-symbols-outlined absolute top-[10px] left-4"
                  style={{ fontSize: '20px' }}
                >
                  coronavirus
                </span>
                <span
                  class="sm:text-transparent material-symbols-outlined absolute top-[10px] left-10"
                  style={{ fontSize: '20px' }}
                >
                  add
                </span>
                <span class="pl-8 text-center sm:inline hidden">Register a condition</span>
              </md-text-button>
            </div>

            <div class="w-10 relative z-98">
              <md-icon-button
                id="legend-button"
                class="mr-2 text-[#7357be]"
                onClick={this.handleToggleLegendMenu}
                title="Legend"
              >
                <span class="material-symbols-outlined text-[#7357be]">more_horiz</span>
              </md-icon-button>
            </div>
          </div>
        </div>

        {this.isDrawerOpen && (
          <div
            class="fixed inset-0 bg-black/50 z-99"
            onClick={() => this.handleResetSelection()}
          />
        )}

        <xcastven-xkilian-project-drawer
          isDrawerOpen={this.isDrawerOpen}
          selectedDate={this.selectedDate}
          selectedAppointment={this.selectedAppointment}
          selectedCondition={this.selectedCondition}
          handleResetSelection={this.handleResetSelection}
          getAppointmentsForDate={this.getAppointmentsForDate}
          getConditionsForDate={this.getConditionsForDate}
          handleSelectAppointment={this.handleSelectAppointment}
          handleSelectCondition={this.handleSelectCondition}
          handleRescheduleAppointment={this.handleRescheduleAppointment}
          handleCancelAppointment={this.handleCancelAppointment}
          handleScheduleAppointmentFromCondition={this.handleScheduleAppointmentFromCondition}
          handleToggleConditionStatus={this.handleToggleConditionStatus}
        />
      </div>
    );
  };
}

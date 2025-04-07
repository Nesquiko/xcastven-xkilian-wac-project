import { AppointmentStatusColor, ConditionOrderColors, DAYS_OF_WEEK, formatDate } from '../../utils/utils';
import { Component, h, Prop } from '@stencil/core';
import { AppointmentDisplay, ConditionDisplay } from '../../api/generated';

@Component({
  tag: 'xcastven-xkilian-project-calendar',
  shadow: false,
})
export class Calendar {
  @Prop() appointments: Array<AppointmentDisplay>;
  @Prop() conditions: Array<ConditionDisplay>;
  @Prop() getConditionsForDate: (date: Date) => Array<ConditionDisplay>;
  @Prop() handleSelectDate: (date: Date) => void;
  @Prop() handleSelectAppointment: (appointment: AppointmentDisplay) => void;
  @Prop() handleSelectCondition: (condition: ConditionDisplay) => void;
  @Prop() hoveredConditionId: string;
  @Prop() setHoveredConditionId: (value: string | null) => void;
  @Prop() currentViewMonth: number;
  @Prop() currentViewYear: number;

  private getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  private getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay: number = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  private getAppointmentTooltipContent = (appointment: AppointmentDisplay) => {
    const displayStatus: string = appointment.status[0].toUpperCase() + appointment.status.slice(1);

    return (
      <div
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10"
      >
        <div class="flex flex-col gap-y-1 w-full">
          <span class="w-full text-center">{appointment.type}</span>

          <div class="flex flex-col gap-y-1 items-center justify-center">
            <div class="space-x-1 flex items-center text-gray-400">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                event
              </span>
              <div>{formatDate(appointment.appointmentDateTime)}</div>
            </div>

            <div class="space-x-1 flex items-center text-gray-400">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                timer
              </span>
              <div>
                {appointment.appointmentDateTime.getHours()}:
                {appointment.appointmentDateTime.getMinutes()}
              </div>
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

  private getConditionTooltipContent = (condition: ConditionDisplay) => {
    return (
      <div
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10"
      >
        <div class="flex flex-col gap-y-1 w-full">
          <span class="w-full text-center">{condition.name}</span>

          <div class="flex flex-col gap-y-1 items-center justify-center">
            <div class="space-x-1 flex items-center text-gray-400">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                line_start_circle
              </span>
              <div>{formatDate(condition.start)}</div>
            </div>

            {condition.end && (
              <div class="space-x-1 flex items-center text-gray-400">
                <span
                  class="material-symbols-outlined"
                  style={{ fontSize: '16px' }}
                >
                  line_end_circle
                </span>
                <div>{formatDate(condition.end)}</div>
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

    const appointmentsByDate = new Map<string, Array<AppointmentDisplay>>();

    this.appointments.forEach((appointment: AppointmentDisplay) => {
      const date: Date = appointment.appointmentDateTime;
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
    this.conditions.forEach((condition: ConditionDisplay, index: number) => {
      conditionColorMap[condition.id] = ConditionOrderColors[index % ConditionOrderColors.length];
    });

    const calculateConditionHeights = () => {
      const sortedConditions: Array<ConditionDisplay> = [...this.conditions]
        .sort((a: ConditionDisplay, b: ConditionDisplay): number =>
          a.start.getTime() - b.start.getTime()
        );

      const timeline: Map<number, Set<string>> = new Map();

      sortedConditions.forEach((condition: ConditionDisplay) => {
        const startTime: number = condition.start.getTime();
        const endTime: number = condition.end ? condition.end.getTime() : startTime;

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

      sortedConditions.forEach((condition: ConditionDisplay) => {
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
      const appointmentsForDay: Array<AppointmentDisplay> = appointmentsByDate.get(dateKey) ?? [];

      const isToday: boolean =
        i === today.getDate() &&
        this.currentViewMonth === today.getMonth() &&
        this.currentViewYear === today.getFullYear();
      const isPastDate: boolean = currentDate < today;

      const conditionsForDate: Array<ConditionDisplay> = this.getConditionsForDate(currentDate);

      currentMonthDays.push(
        <div
          role="button"
          class={`flex flex-col text-sm relative w-full items-center justify-center
          ${isPastDate ? 'text-gray-400' : 'hover:border-[#9d83c6] hover:border-2 bg-[#f0eafa]'}
        `}
          onClick={(event: MouseEvent) => {
            event.stopPropagation();
            this.handleSelectDate(currentDate);
          }}
        >
          <span class={`py-1 w-full text-center ${isToday && 'bg-[#7357be] text-white'}`}>{i}</span>

          <div class="relative w-full h-full flex flex-row flex-wrap gap-1 items-start justify-center">
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

          {conditionsForDate.map((condition: ConditionDisplay) => {
            const isStartDate: boolean = currentDate.getTime() === condition.start.getTime();
            const isEndDate: boolean = condition.end && currentDate.getTime() === condition.end.getTime();

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

  render() {
    return (
      <div class="flex flex-1 h-[calc(100vh-96px)] flex-col overflow-x-hidden overflow-y-auto">
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
      </div>
    );
  }
}

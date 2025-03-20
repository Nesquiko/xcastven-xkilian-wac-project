import { StyledHost } from '../StyledHost';
import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'appointment-scheduler',
  shadow: false,
})
export class AppointmentScheduler {
  @State() selectedDate: Date = new Date(2021, 3, 7); // April 7th, 2021
  @State() selectedTime: string = '7:00';
  @State() appointmentType: string = 'Check-up';
  @State() doctor: string = 'Dr. John Doe';
  @State() appointmentReason: string = '';
  @State() showTimeMenu: boolean = false;

  private daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  private availableTimes = ['7:00', '8:00', '9:00', '10:00'];

  // Generate days for the calendar
  private getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  private getFirstDayOfMonth(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to be the last day (6) to match our UI
    return firstDay === 0 ? 6 : firstDay - 1;
  }

  private renderCalendar() {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const currentDay = this.selectedDate.getDate();

    const daysInMonth = this.getDaysInMonth(year, month);
    const firstDayOfMonth = this.getFirstDayOfMonth(year, month);

    const prevMonthDays = [];
    const currentMonthDays = [];
    const nextMonthDays = [];

    // Previous month days
    const daysInPrevMonth = this.getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      prevMonthDays.unshift(<div class="px-3 py-2 text-center text-sm text-gray-400">{daysInPrevMonth - i}</div>);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = i === currentDay;
      currentMonthDays.push(
        <div class={`cursor-pointer px-3 py-2 text-center text-sm ${isSelected ? 'selected-day' : 'hover:bg-gray-200'}`} onClick={() => this.selectDate(i)}>
          {i}
        </div>,
      );
    }

    // Next month days
    const totalCells = 42; // 6 rows x 7 columns
    const remainingCells = totalCells - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push(<div class="px-3 py-2 text-center text-sm text-gray-400">{i}</div>);
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }

  private selectDate(day: number) {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(day);
    this.selectedDate = newDate;
  }

  private getMonthName() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[this.selectedDate.getMonth()];
  }

  private prevMonth() {
    const newDate = new Date(this.selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.selectedDate = newDate;
  }

  private nextMonth() {
    const newDate = new Date(this.selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.selectedDate = newDate;
  }

  private toggleTimeMenu() {
    this.showTimeMenu = !this.showTimeMenu;
  }

  private selectTime(time: string) {
    this.selectedTime = time;
    this.showTimeMenu = false;
  }

  render() {
    return (
      <StyledHost>
        <div class="mx-auto flex h-screen flex-col md:max-w-4xl">
          {/* Header */}
          <div class="bg-primary flex items-center p-4 text-white">
            <md-icon-button class="mr-2">
              <span class="material-symbols-outlined">arrow_back</span>
            </md-icon-button>
            <h1 class="flex-1 text-center text-xl font-medium">Schedule an appointment</h1>
            <div class="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
              <span class="material-symbols-outlined flex h-full items-center justify-center">account_circle</span>
            </div>
          </div>

          {/* Content */}
          <div class="flex flex-1 flex-col md:flex-row">
            {/* Left panel - Calendar */}
            <div class="bg-gray-100 p-6 md:w-1/2">
              <div class="rounded-lg bg-white p-4 shadow-md">
                <h2 class="mb-4 font-medium">Date</h2>

                <div class="mb-4 flex items-center justify-between">
                  <md-icon-button onClick={() => this.prevMonth()}>
                    <span class="material-symbols-outlined">chevron_left</span>
                  </md-icon-button>
                  <div class="text-center">
                    <span class="font-medium">{this.getMonthName()}</span>
                    <span class="mx-1">,</span>
                    <span>{this.selectedDate.getFullYear()}</span>
                  </div>
                  <md-icon-button onClick={() => this.nextMonth()}>
                    <span class="material-symbols-outlined">chevron_right</span>
                  </md-icon-button>
                </div>

                <div class="grid grid-cols-7 gap-1">
                  {this.daysOfWeek.map(day => (
                    <div class="px-3 py-2 text-center text-sm font-medium text-gray-600">{day}</div>
                  ))}
                  {this.renderCalendar()}
                </div>
              </div>

              {/* Time selector */}
              <div class="mt-6">
                <h2 class="mb-4 font-medium">Time</h2>
                <div class="relative rounded-lg bg-white p-4 shadow-md">
                  <div class="relative">
                    <div class="select-wrapper" onClick={() => this.toggleTimeMenu()}>
                      <md-filled-field class="w-full">
                        <div slot="content" class="flex w-full items-center justify-between">
                          <span>{this.selectedTime}</span>
                          <span class="material-symbols-outlined">{this.showTimeMenu ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
                        </div>
                      </md-filled-field>
                    </div>

                    {this.showTimeMenu && (
                      <md-menu open class="time-menu">
                        <md-list>
                          {this.availableTimes.map(time => (
                            <md-list-item onClick={() => this.selectTime(time)} class={time === this.selectedTime ? 'selected-time' : ''}>
                              {time}
                            </md-list-item>
                          ))}
                        </md-list>
                      </md-menu>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel - Details */}
            <div class="p-6 md:w-1/2">
              <div class="mb-6">
                <h2 class="text-2xl font-bold">
                  April 7th 2021 <span class="text-gray-500">at {this.selectedTime}</span>
                </h2>
              </div>

              <div class="mb-6">
                <md-filled-select label="Appointment type" class="w-full">
                  <md-select-option value="check-up" selected>
                    <div slot="headline">Check-up</div>
                  </md-select-option>
                  <md-select-option value="follow-up">
                    <div slot="headline">Follow-up</div>
                  </md-select-option>
                  <md-select-option value="consultation">
                    <div slot="headline">Consultation</div>
                  </md-select-option>
                </md-filled-select>
              </div>

              <div class="mb-6">
                <md-filled-select label="Doctor / Specialist" class="w-full">
                  <md-select-option value="dr-john-doe" selected>
                    <div slot="headline">Dr. John Doe</div>
                  </md-select-option>
                  <md-select-option value="dr-jane-smith">
                    <div slot="headline">Dr. Jane Smith</div>
                  </md-select-option>
                  <md-select-option value="dr-samuel-johnson">
                    <div slot="headline">Dr. Samuel Johnson</div>
                  </md-select-option>
                </md-filled-select>
              </div>

              <div class="mb-6">
                <md-filled-text-field
                  class="w-full"
                  label="Appointment reason"
                  placeholder="Briefly describe your reason for visit (optional)"
                  type="textarea"
                  rows="4"
                  value={this.appointmentReason}
                  onInput={(e: Event) => (this.appointmentReason = (e.target as HTMLTextAreaElement).value)}
                ></md-filled-text-field>
              </div>

              <md-filled-button class="w-full">Schedule</md-filled-button>
            </div>
          </div>
        </div>
      </StyledHost>
    );
  }
}

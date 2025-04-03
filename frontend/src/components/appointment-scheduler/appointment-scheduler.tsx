import { Component, h, State } from '@stencil/core';
import { AppointmentType, Doctor, TimeSlot } from '../../lib/types';
import { DAYS_OF_WEEK, getDateAndTimeTitle, MONTHS, TODAY } from '../../utils/utils';

const data = {
  availableTimes: [
    { time: "7:00", status: "available" },
    { time: "8:00", status: "unavailable" },
    { time: "9:00", status: "available" },
    { time: "10:00", status: "available" },
    { time: "11:00", status: "unavailable" },
    { time: "12:00", status: "available" },
    { time: "13:00", status: "unavailable" },
    { time: "14:00", status: "unavailable" },
  ] satisfies Array<TimeSlot>,
  appointmentTypes: [
    { id: "1", displayName: "Check-Up" },
    { id: "2", displayName: "Follow-Up" },
    { id: "3", displayName: "Consultation" },
  ] satisfies Array<AppointmentType>,
  doctors: [
    { id: "1", displayName: "Dr. John Doe", specialty: "dental" },
    { id: "2", displayName: "Dr. Jane Smith", specialty: "optic" },
    { id: "3", displayName: "Dr. Samuel Johnson", specialty: "pediatric" },
  ] satisfies Array<Doctor>,
};

@Component({
  tag: 'appointment-scheduler',
  shadow: false,
})
export class AppointmentScheduler {
  @State() selectedDate: Date = null;
  @State() selectedTime: string = null;
  @State() selectedAppointmentType: string;
  @State() selectedDoctor: string;
  @State() appointmentReason: string = "";
  @State() currentViewMonth: number = TODAY.getMonth();
  @State() currentViewYear: number = TODAY.getFullYear();

  private availableTimes: Array<TimeSlot> = data.availableTimes;
  private appointmentTypes: Array<AppointmentType> = data.appointmentTypes;
  private doctors: Array<Doctor> = data.doctors;

  private getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  private getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  private renderCalendar = () => {
    const year = this.currentViewYear;
    const month = this.currentViewMonth;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysInMonth = this.getDaysInMonth(year, month);
    const firstDayOfMonth = this.getFirstDayOfMonth(year, month);

    const prevMonthDays = [];
    const currentMonthDays = [];
    const nextMonthDays = [];

    const daysInPrevMonth = this.getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      prevMonthDays.unshift(
        <div class="px-3 py-2 text-center text-sm text-gray-400">
          {daysInPrevMonth - i}
        </div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      currentDate.setHours(0, 0, 0, 0);

      const isSelected: boolean =
        this.selectedDate &&
        this.selectedDate.getDate() === i &&
        this.selectedDate.getMonth() === month &&
        this.selectedDate.getFullYear() === year;

      const isPastDate = currentDate < today;

      currentMonthDays.push(
        <div
          class={`px-3 py-2 text-center rounded-md text-sm ${
            isSelected
              ? "bg-[#7357be] text-white"
              : isPastDate
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200 cursor-pointer"
          }`}
          onClick={() => !isPastDate && this.selectDate(i)}
        >
          {i}
        </div>
      );
    }

    const totalCells = 42;
    const remainingCells =
      totalCells - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push(
        <div class="px-3 py-2 text-center text-sm text-gray-400">{i}</div>
      );
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  private selectDate = (day: number) => {
    this.selectedDate = new Date(this.currentViewYear, this.currentViewMonth, day);
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

  private handleTimeChange = (event: Event) => {
    this.selectedTime = (event.target as HTMLSelectElement).value;
  };

  private handleAppointmentTypeChange = (event: Event) => {
    this.selectedAppointmentType = (event.target as HTMLSelectElement).value;
  };

  private handleDoctorChange = (event: Event) => {
    this.selectedDoctor = (event.target as HTMLSelectElement).value;
  };

  private handleAppointmentReasonChange = (event: Event) => {
    this.appointmentReason = (event.target as HTMLTextAreaElement).value;
  };

  private handleScheduleAppointment = () => {
    console.log(
      "Schedule an appointment:" +
      "\nDate: " +
      this.selectedDate +
      "\nTime: " +
      this.selectedTime +
      "\nType: " +
      this.selectedAppointmentType +
      "\nDoctor: " +
      this.selectedDoctor +
      "\nReason: " +
      this.appointmentReason
    );
  };

  private resetSelection = () => {
    this.selectedDate = null;
    this.selectedTime = null;
    this.selectedAppointmentType = null;
    this.selectedDoctor = null;
    this.appointmentReason = "";
  };

  private showDetailsPanel = () => {
    return this.selectedDate !== null && this.selectedTime !== null;
  };

  render() {
    const currentYear: number = TODAY.getFullYear();
    const yearOptions: Array<number> = [];
    for (let i = 0; i <= 5; i++) {
      yearOptions.push(currentYear + i);
    }

    const showDetails = this.showDetailsPanel();

    return (
        <div class="flex h-screen flex-col w-full flex-1 overflow-auto">
          {/* Header */}
          <div class="bg-gray-800 flex items-center p-3 text-white">
            <md-icon-button
              class="mr-2"
              onClick={showDetails ? () => this.resetSelection() : undefined}
            >
              <span class="material-symbols-outlined text-white">
                {showDetails ? "arrow_back" : "menu"}
              </span>
            </md-icon-button>
            <h1 class="flex-1 text-center text-xl font-medium">
              {(showDetails ? 'Complete your appointment' : 'Schedule an appointment')}
              <a class="text-gray-400 text-sm ml-5 hover:underline" target="_blank" href="https://github.com/Nesquiko/xcastven-xkilian-wac-project">Link to repo</a>
            </h1>
            <md-icon-button
              class="mr-2"
              onClick={showDetails ? () => this.resetSelection() : undefined}
            >
              <span class="material-symbols-outlined text-white">
                account_circle
              </span>
            </md-icon-button>
          </div>

          {/* Content */}
          <div class="flex flex-1 flex-col md:flex-row mx-auto w-full">
            {/* Left panel - Calendar */}
            <div
              class={`flex flex-col justify-center items-center bg-gray-300 p-6 transition-all duration-600 ease-in-out ${
                showDetails ? "md:w-1/2 w-full" : "w-full"
              }`}>
              <div class="max-w-md w-full rounded-lg bg-white p-4 shadow-md mb-6">
                <div class="mb-4 flex items-center justify-between">
                  <md-icon-button onClick={() => this.prevMonth()}>
                    <span class="material-symbols-outlined">chevron_left</span>
                  </md-icon-button>
                  <div class="text-center flex items-center">
                    <span class="font-medium">{this.getMonthName()}</span>
                    <span class="mx-1">,</span>
                    <select
                      class="bg-transparent border-none font-medium"
                      onChange={(e: Event) => this.handleYearChange(e)}
                    >
                      {yearOptions.map((year) => (
                        <option
                          value={year.toString()}
                          selected={year === this.currentViewYear}
                        >
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <md-icon-button onClick={() => this.nextMonth()}>
                    <span class="material-symbols-outlined">chevron_right</span>
                  </md-icon-button>
                </div>

                <div class="grid grid-cols-7 gap-1">
                  {DAYS_OF_WEEK.map((day) => (
                    <div class="px-3 py-2 text-center text-sm font-medium text-gray-600">
                      {day.short}
                    </div>
                  ))}
                  {this.renderCalendar()}
                </div>
              </div>

              {/* Time selector */}
              <div class="max-w-lg w-full px-4">
                <md-filled-select
                  label="Select a time"
                  class="w-full"
                  value={this.selectedTime}
                  onInput={(e: Event) => this.handleTimeChange(e)}
                >
                  {this.availableTimes.map((time: TimeSlot) => (
                    <md-select-option
                      value={time.time}
                      disabled={time.status !== "available"}
                    >
                      <div slot="headline">{time.time}</div>
                    </md-select-option>
                  ))}
                </md-filled-select>
              </div>

              {/* Selected date and time summary (visible on mobile when details panel is shown) */}
              {showDetails && (
                <div class="mt-6 p-4 bg-white rounded-lg shadow-md md:hidden">
                  {getDateAndTimeTitle(this.selectedDate, this.selectedTime)}
                </div>
              )}
            </div>

            {/* Right panel - Details */}
            {showDetails && (
              <div
                class={`m-auto p-6 md:w-1/2 max-w-lg w-full flex flex-col justify-center transform transition-all duration-500 ease-in-out opacity-100
                         animate-[slideInFromBottom_0.5s_ease-out]
                         md:animate-[slideInFromRight_0.5s_ease-out]`}
              >
                <div class="mb-6 hidden md:block">
                  {getDateAndTimeTitle(this.selectedDate, this.selectedTime)}
                </div>

                <div class="mb-6">
                  <md-filled-select
                    label="Appointment type"
                    class="w-full"
                    value={this.selectedAppointmentType}
                    onInput={(e: Event) => this.handleAppointmentTypeChange(e)}
                  >
                    {this.appointmentTypes.map((appointmentType: AppointmentType) => (
                      <md-select-option value={appointmentType.id}>
                        <div slot="headline">{appointmentType.displayName}</div>
                      </md-select-option>
                    ))}
                  </md-filled-select>
                </div>

                <div class="mb-6">
                  <md-filled-select
                    label="Doctor / Specialist"
                    class="w-full"
                    value={this.selectedDoctor}
                    onInput={(e: Event) => this.handleDoctorChange(e)}
                  >
                    {this.doctors.map((doctor: Doctor) => (
                      <md-select-option value={doctor.id}>
                        <div slot="headline">{doctor.displayName}</div>
                      </md-select-option>
                    ))}
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
                    onInput={(e: Event) => this.handleAppointmentReasonChange(e)}
                  ></md-filled-text-field>
                </div>

                <md-filled-button
                  class="w-full rounded-full bg-[#7357be] text-white"
                  onClick={() => this.handleScheduleAppointment()}
                >
                  Schedule
                </md-filled-button>
              </div>
            )}
          </div>
        </div>
    );
  };
}

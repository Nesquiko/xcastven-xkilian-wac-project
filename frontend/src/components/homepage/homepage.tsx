import { Component, h, State } from '@stencil/core';
import {
  TODAY,
} from '../../utils/utils';
import { AppointmentDisplay, ConditionDisplay, PatientsCalendar } from '../../api/generated';
import { PatientsCalendarExample } from '../../data-examples/patients-calendar';

@Component({
  tag: 'xcastven-xkilian-project-home-page',
  shadow: false,
})
export class Homepage {
  private DATA: PatientsCalendar = PatientsCalendarExample;

  @State() appointments: Array<AppointmentDisplay> = this.DATA.appointments;
  @State() conditions: Array<ConditionDisplay> = this.DATA.conditions;
  @State() selectedAppointment: AppointmentDisplay = null;
  @State() selectedCondition: ConditionDisplay = null;
  @State() selectedDate: Date = null;
  @State() isDrawerOpen: boolean = false;
  @State() hoveredConditionId: string = null;

  @State() currentViewMonth: number = TODAY.getMonth();
  @State() currentViewYear: number = TODAY.getFullYear();

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

  private handleScheduleAppointment = () => {
    console.log('Schedule an appointment');
  };

  private handleRegisterCondition = () => {
    console.log('Register a condition');
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

  private handleSelectDate = (date: Date) => {
    this.selectedDate = date;
    this.selectedAppointment = null;
    this.selectedCondition = null;
    this.isDrawerOpen = true;
  };

  private handleSelectAppointment = (appointment: AppointmentDisplay) => {
    this.selectedAppointment = appointment;
    this.selectedCondition = null;
    this.selectedDate = null;
    this.isDrawerOpen = true;
  };

  private handleSelectCondition = (condition: ConditionDisplay) => {
    this.selectedCondition = condition;
    this.selectedAppointment = null;
    this.selectedDate = null;
    this.isDrawerOpen = true;
  };

  private handleScheduleAppointmentFromCondition = () => {
    console.log('Schedule an appointment for condition:', this.selectedCondition);
  };

  private handleToggleConditionStatus = () => {
    this.selectedCondition = {
      ...this.selectedCondition,
      end: new Date(),
    };
  };

  private getAppointmentsForDate = (date: Date): Array<AppointmentDisplay> => {
    return this.appointments.filter((appointment: AppointmentDisplay) => {
      const appointmentDate: Date = new Date(appointment.appointmentDateTime);
      return (
        appointmentDate.getFullYear() === date.getFullYear() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getDate() === date.getDate()
      );
    });
  };

  private getConditionsForDate = (date: Date): Array<ConditionDisplay> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.conditions.filter((condition: ConditionDisplay) => {
      const { start, end } = condition;
      const effectiveEndDate: Date = end ? end : today;
      return date >= start && date <= effectiveEndDate;
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

        <xcastven-xkilian-project-calendar
          appointments={this.appointments}
          conditions={this.conditions}
          getConditionsForDate={this.getConditionsForDate}
          handleSelectDate={this.handleSelectDate}
          handleSelectAppointment={this.handleSelectAppointment}
          handleSelectCondition={this.handleSelectCondition}
          hoveredConditionId={this.hoveredConditionId}
          setHoveredConditionId={(value: string | null) => this.hoveredConditionId = value}
          currentViewMonth={this.currentViewMonth}
          currentViewYear={this.currentViewYear}
        />

        <xcastven-xkilian-project-footer
          handleScheduleAppointment={this.handleScheduleAppointment}
          handleRegisterCondition={this.handleRegisterCondition}
          handleToggleLegendMenu={this.handleToggleLegendMenu}
        />

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

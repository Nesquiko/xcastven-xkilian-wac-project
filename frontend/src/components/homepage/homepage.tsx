import { AppointmentDisplay, ConditionDisplay, PrescriptionDisplay, UserRole } from '../../api/generated';
import { PatientsCalendarExample } from '../../data-examples/patients-calendar';
import { TODAY } from '../../utils/utils';
import { StyledHost } from '../StyledHost';
import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-home-page',
  shadow: false,
})
export class Homepage {
  private user: { email: string; role: UserRole } = JSON.parse(sessionStorage.getItem('user'));
  private isDoctor: boolean = this.user.role === 'doctor';

  @State() appointments: Array<AppointmentDisplay> = PatientsCalendarExample.appointments;
  @State() conditions: Array<ConditionDisplay> = PatientsCalendarExample.conditions;
  @State() prescriptions: Array<PrescriptionDisplay> = PatientsCalendarExample.prescriptions;

  @State() selectedDate: Date = null;
  @State() selectedAppointment: AppointmentDisplay = null;
  @State() selectedCondition: ConditionDisplay = null;
  @State() selectedPrescription: PrescriptionDisplay = null;
  @State() isDrawerOpen: boolean = false;
  @State() showLegend: boolean = false;

  @State() hoveredConditionId: string = null;
  @State() hoveredPrescriptionId: string = null;

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
    this.showLegend = true;
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
    this.selectedPrescription = null;
    this.showLegend = false;
  };

  private handleSelectDate = (date: Date) => {
    this.showLegend = false;
    this.selectedDate = date;
    this.selectedAppointment = null;
    this.selectedCondition = null;
    this.selectedPrescription = null;
    this.isDrawerOpen = true;
  };

  private handleSelectAppointment = (appointment: AppointmentDisplay) => {
    this.showLegend = false;
    this.selectedAppointment = appointment;
    this.selectedCondition = null;
    this.selectedDate = null;
    this.selectedPrescription = null;
    this.isDrawerOpen = true;
  };

  private handleSelectCondition = (condition: ConditionDisplay) => {
    this.showLegend = false;
    this.selectedCondition = condition;
    this.selectedAppointment = null;
    this.selectedDate = null;
    this.selectedPrescription = null;
    this.isDrawerOpen = true;
  };

  private handleSelectPrescription = (prescription: PrescriptionDisplay) => {
    this.showLegend = false;
    this.selectedPrescription = prescription;
    this.selectedDate = null;
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
      end: new Date(),
    };
  };

  private getAppointmentsForDate = (date: Date): Array<AppointmentDisplay> => {
    return this.appointments.filter((appointment: AppointmentDisplay): boolean => {
      const appointmentDate: Date = new Date(appointment.appointmentDateTime);
      return appointmentDate.getFullYear() === date.getFullYear() && appointmentDate.getMonth() === date.getMonth() && appointmentDate.getDate() === date.getDate();
    });
  };

  private getConditionsForDate = (date: Date): Array<ConditionDisplay> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.conditions.filter((condition: ConditionDisplay): boolean => {
      const { start, end } = condition;
      const effectiveEndDate: Date = end ? end : today;
      return date >= start && date <= effectiveEndDate;
    });
  };

  private getPrescriptionsForDate = (date: Date): Array<PrescriptionDisplay> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prescriptions
      .filter((prescription: PrescriptionDisplay): boolean => {
        const { start, end } = prescription;
        return date >= start && date <= end;
      })
      .sort((a: PrescriptionDisplay, b: PrescriptionDisplay) => b.start.getTime() - a.start.getTime());
  };

  render() {
    return (
      <StyledHost class="flex h-screen w-full flex-col overflow-hidden">
        <xcastven-xkilian-project-header
          currentViewMonth={this.currentViewMonth}
          currentViewYear={this.currentViewYear}
          handlePreviousMonth={this.handlePreviousMonth}
          handleNextMonth={this.handleNextMonth}
          handleYearChange={this.handleYearChange}
        />

        <xcastven-xkilian-project-calendar
          user={this.user}
          isDoctor={this.isDoctor}
          appointments={this.appointments}
          conditions={this.conditions}
          prescriptions={this.prescriptions}
          getConditionsForDate={this.getConditionsForDate}
          getPrescriptionsForDate={this.getPrescriptionsForDate}
          handleSelectDate={this.handleSelectDate}
          handleSelectAppointment={this.handleSelectAppointment}
          handleSelectCondition={this.handleSelectCondition}
          handleSelectPrescription={this.handleSelectPrescription}
          hoveredConditionId={this.hoveredConditionId}
          setHoveredConditionId={(value: string | null) => (this.hoveredConditionId = value)}
          hoveredPrescriptionId={this.hoveredPrescriptionId}
          setHoveredPrescriptionId={(value: string | null) => (this.hoveredPrescriptionId = value)}
          currentViewMonth={this.currentViewMonth}
          currentViewYear={this.currentViewYear}
          handlePreviousMonth={this.handlePreviousMonth}
          handleNextMonth={this.handleNextMonth}
        />

        <xcastven-xkilian-project-footer
          handleScheduleAppointment={this.handleScheduleAppointment}
          handleRegisterCondition={this.handleRegisterCondition}
          handleToggleLegendMenu={this.handleToggleLegendMenu}
        />

        {this.isDrawerOpen && <div class="fixed inset-0 z-99 bg-black/50" onClick={() => this.handleResetSelection()} />}

        <xcastven-xkilian-project-drawer
          isDrawerOpen={this.isDrawerOpen}
          selectedDate={this.selectedDate}
          selectedAppointment={this.selectedAppointment}
          selectedCondition={this.selectedCondition}
          selectedPrescription={this.selectedPrescription}
          showLegend={this.showLegend}
          handleResetSelection={this.handleResetSelection}
          getAppointmentsForDate={this.getAppointmentsForDate}
          getConditionsForDate={this.getConditionsForDate}
          getPrescriptionsForDate={this.getPrescriptionsForDate}
          handleSelectAppointment={this.handleSelectAppointment}
          handleSelectCondition={this.handleSelectCondition}
          handleSelectPrescription={this.handleSelectPrescription}
          handleRescheduleAppointment={this.handleRescheduleAppointment}
          handleCancelAppointment={this.handleCancelAppointment}
          handleScheduleAppointmentFromCondition={this.handleScheduleAppointmentFromCondition}
          handleToggleConditionStatus={this.handleToggleConditionStatus}
        />
      </StyledHost>
    );
  }
}

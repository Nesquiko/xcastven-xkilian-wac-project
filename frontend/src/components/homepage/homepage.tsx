import { Api, ApiError } from '../../api/api';
import {
  AppointmentDisplay,
  AppointmentStatus,
  Condition,
  ConditionDisplay,
  DoctorAppointment,
  Equipment,
  Facility,
  Medicine,
  PatientAppointment,
  PrescriptionDisplay,
  User,
} from '../../api/generated';
import { TODAY } from '../../utils/utils';
import { StyledHost } from '../StyledHost';
import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-home-page',
  shadow: false,
})
export class Homepage {
  private user: User = JSON.parse(sessionStorage.getItem('user'));
  private isDoctor: boolean = this.user.role === 'doctor';

  @Prop() api: Api;

  @State() appointments: Array<AppointmentDisplay> = [];
  @State() conditions: Array<ConditionDisplay> = [];
  @State() prescriptions: Array<PrescriptionDisplay> = [];

  @State() selectedDate: Date = null;
  @State() selectedAppointment: AppointmentDisplay = null;
  @State() selectedCondition: ConditionDisplay = null;
  @State() selectedPrescription: PrescriptionDisplay = null;
  @State() selectedAppointmentStatusGroup: AppointmentStatus = null;

  @State() isDrawerOpen: boolean = false;
  @State() showLegend: boolean = false;

  @State() hoveredConditionId: string = null;
  @State() hoveredPrescriptionId: string = null;

  @State() currentViewMonth: number = TODAY.getMonth();
  @State() currentViewYear: number = TODAY.getFullYear();

  @State() activeTab: number = 0;

  async componentWillLoad() {
    this.loadCalendar();
  }

  private async loadCalendar() {
    const fromDate = new Date(this.currentViewYear, this.currentViewMonth, 1);
    const toDate = new Date(this.currentViewYear, this.currentViewMonth + 1, 0);

    try {
      if (this.isDoctor) {
        const calendar = await this.api.doctors.doctorsCalendar({
          doctorId: this.user.id,
          from: fromDate,
          to: toDate,
        });
        this.appointments = calendar.appointments ?? [];
      } else {
        const calendar = await this.api.patients.patientsCalendar({
          patientId: this.user.id,
          from: fromDate,
          to: toDate,
        });
        this.appointments = calendar.appointments ?? [];
        this.conditions = calendar.conditions ?? [];
        this.prescriptions = calendar.prescriptions ?? [];
      }
    } catch (err) {
      if (!(err instanceof ApiError)) {
        // TODO kili some generic error
        return;
      }

      // TODO kili some internal server error, i think there is no other error I'm returing
    }
  }

  private handlePreviousMonth = () => {
    if (this.currentViewMonth === 0) {
      this.currentViewMonth = 11;
      this.currentViewYear--;
    } else {
      this.currentViewMonth--;
    }
    this.loadCalendar();
  };

  private handleNextMonth = () => {
    if (this.currentViewMonth === 11) {
      this.currentViewMonth = 0;
      this.currentViewYear++;
    } else {
      this.currentViewMonth++;
    }
    this.loadCalendar();
  };

  private handleYearChange = (event: Event) => {
    this.currentViewYear = parseInt((event.target as HTMLSelectElement).value);
    this.loadCalendar();
  };

  private handleToggleLegendMenu = () => {
    this.selectedDate = null;
    this.selectedAppointment = null;
    this.selectedCondition = null;
    this.showLegend = true;
    this.isDrawerOpen = true;
  };

  private handleRescheduleAppointment = async (
    appointment: PatientAppointment | DoctorAppointment,
  ) => {
    try {
      await this.api.appointments.rescheduleAppointment({
        appointmentId: appointment.id,
        appointmentReschedule: {
          // TODO kili I don't know if the appointment has rescheduled appointmentDateTime, if yes, then delete this commend, otherwise get it here
          newAppointmentDateTime: appointment.appointmentDateTime,
          // TODO kili there can be reason
          reason: 'TODO kili reason',
        },
      });
    } catch (err) {
      if (!(err instanceof ApiError)) {
        // TODO kili some generic error
        return;
      }
      // TODO kili 409 when the doctor is unavailable in rescheduled time and internal server error, i think there is no other error I'm returing
    }
  };

  private handleCancelAppointment = async (appointment: PatientAppointment | DoctorAppointment) => {
    try {
      await this.api.appointments.cancelAppointment({
        appointmentId: appointment.id,
        appointmentCancellation: { reason: 'TODO kili reason' },
      });
      // TODO kili this doesn't return anything, it is up to you how will you change the appointment status
    } catch (err) {
      if (!(err instanceof ApiError)) {
        // TODO kili some generic error
        return;
      }
      // TODO kili some internal server error, i think there is no other error I'm returing
    }
  };

  private handleAcceptAppointment = async (appointment: PatientAppointment | DoctorAppointment) => {
    // TODO kili when accepting an appointment, you can also pass resources
    try {
      await this.api.appointments.decideAppointment({
        appointmentId: appointment.id,
        appointmentDecision: { action: 'accept', medicine: [], facilities: [], equipment: [] },
      });
      // TODO kili this returns DoctorAppointment, it is up to you how will you change the appointment status
    } catch (err) {
      if (!(err instanceof ApiError)) {
        // TODO kili some generic error
        return;
      }
      // TODO kili handle 409 conflict if resources are unavailable, or internal server error, i think there is no other error I'm returing
    }
  };

  private handleDenyAppointment = async (appointment: PatientAppointment | DoctorAppointment) => {
    // TODO kili when denying an appointment there can be reason
    try {
      // TODO kili when rejecting there can also be a reason
      await this.api.appointments.decideAppointment({
        appointmentId: appointment.id,
        appointmentDecision: { action: 'reject', reason: 'TODO kili reason' },
      });
      // TODO kili this returns DoctorAppointment, it is up to you how will you change the appointment status
    } catch (err) {
      if (!(err instanceof ApiError)) {
        // TODO kili some generic error
        return;
      }
      // TODO kili some internal server error, i think there is no other error I'm returing
    }
  };

  private handleSaveResourcesOnAppointment = (
    appointment: PatientAppointment | DoctorAppointment,
    resources: {
      facility: Facility;
      equipment: Equipment;
      medicine: Medicine;
    },
  ) => {
    console.log('Save resources on appointment', appointment, resources);
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
    this.handleResetSelection();
    this.selectedDate = date;
    this.selectedAppointmentStatusGroup = 'scheduled';
    this.isDrawerOpen = true;
  };

  private handleSelectAppointment = (appointment: AppointmentDisplay) => {
    this.handleResetSelection();
    this.selectedAppointment = appointment;
    this.isDrawerOpen = true;
  };

  private handleSelectCondition = (condition: ConditionDisplay) => {
    this.handleResetSelection();
    this.selectedCondition = condition;
    this.isDrawerOpen = true;
  };

  private handleSelectPrescription = (prescription: PrescriptionDisplay) => {
    this.handleResetSelection();
    this.selectedPrescription = prescription;
    this.isDrawerOpen = true;
  };

  private handleSelectAppointmentStatusGroup = (
    date: Date,
    appointmentStatus: AppointmentStatus,
  ) => {
    this.handleResetSelection();
    this.selectedDate = date;
    this.selectedAppointmentStatusGroup = appointmentStatus;
    this.isDrawerOpen = true;

    if (this.isDoctor) {
      const statusToTabIndex: Record<AppointmentStatus, number> = {
        scheduled: 0,
        requested: 1,
        denied: 2,
        completed: 3,
        cancelled: 4,
      };
      this.activeTab = statusToTabIndex[appointmentStatus];
    }
  };

  private handleScheduleAppointmentFromCondition = (condition: Condition) => {
    // TODO kili i need NewAppointmentRequest with conditionId set
    console.log('Schedule an appointment for condition:', condition);
  };

  private handleToggleConditionStatus = (condition: Condition) => {
    console.log('Toggle status of condition:', condition);
  };

  private getAppointmentsForDate = (date: Date): Array<AppointmentDisplay> => {
    return this.appointments.filter((appointment: AppointmentDisplay): boolean => {
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
      .sort(
        (a: PrescriptionDisplay, b: PrescriptionDisplay) => b.start.getTime() - a.start.getTime(),
      );
  };

  private getAppointmentsForDateByStatus = (date: Date, appointmentStatus: AppointmentStatus) => {
    return this.appointments.filter((appointment: AppointmentDisplay): boolean => {
      if (appointment.status === appointmentStatus) {
        const appointmentDate: Date = new Date(appointment.appointmentDateTime);
        return (
          appointmentDate.getFullYear() === date.getFullYear() &&
          appointmentDate.getMonth() === date.getMonth() &&
          appointmentDate.getDate() === date.getDate()
        );
      }
    });
  };

  render() {
    return (
      <StyledHost class="flex h-screen w-full flex-col overflow-hidden">
        <xcastven-xkilian-project-header
          type="calendar"
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
          handleSelectAppointmentStatusGroup={this.handleSelectAppointmentStatusGroup}
          hoveredConditionId={this.hoveredConditionId}
          setHoveredConditionId={(value: string | null) => (this.hoveredConditionId = value)}
          hoveredPrescriptionId={this.hoveredPrescriptionId}
          setHoveredPrescriptionId={(value: string | null) => (this.hoveredPrescriptionId = value)}
          currentViewMonth={this.currentViewMonth}
          currentViewYear={this.currentViewYear}
          handlePreviousMonth={this.handlePreviousMonth}
          handleNextMonth={this.handleNextMonth}
        />

        <xcastven-xkilian-project-footer handleToggleLegendMenu={this.handleToggleLegendMenu} />

        {this.isDrawerOpen && (
          <div class="fixed inset-0 z-99 bg-black/50" onClick={() => this.handleResetSelection()} />
        )}

        <xcastven-xkilian-project-drawer
          api={this.api}
          user={this.user}
          isDoctor={this.isDoctor}
          isDrawerOpen={this.isDrawerOpen}
          selectedDate={this.selectedDate}
          selectedAppointment={this.selectedAppointment}
          selectedCondition={this.selectedCondition}
          selectedPrescription={this.selectedPrescription}
          selectedAppointmentStatusGroup={this.selectedAppointmentStatusGroup}
          showLegend={this.showLegend}
          activeTab={this.activeTab}
          handleTabChange={(event: any) => (this.activeTab = event.target.activeTabIndex)}
          handleResetSelection={this.handleResetSelection}
          getAppointmentsForDate={this.getAppointmentsForDate}
          getConditionsForDate={this.getConditionsForDate}
          getPrescriptionsForDate={this.getPrescriptionsForDate}
          getAppointmentsForDateByStatus={this.getAppointmentsForDateByStatus}
          handleSelectAppointment={this.handleSelectAppointment}
          handleSelectCondition={this.handleSelectCondition}
          handleSelectPrescription={this.handleSelectPrescription}
          handleRescheduleAppointment={this.handleRescheduleAppointment}
          handleCancelAppointment={this.handleCancelAppointment}
          handleAcceptAppointment={this.handleAcceptAppointment}
          handleDenyAppointment={this.handleDenyAppointment}
          handleSaveResourcesOnAppointment={this.handleSaveResourcesOnAppointment}
          handleScheduleAppointmentFromCondition={this.handleScheduleAppointmentFromCondition}
          handleToggleConditionStatus={this.handleToggleConditionStatus}
        />
      </StyledHost>
    );
  }
}
function Prop(): (target: Homepage, propertyKey: 'api') => void {
  throw new Error('Function not implemented.');
}

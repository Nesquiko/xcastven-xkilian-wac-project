import { Api } from '../../api/api';
import {
  AppointmentType,
  ConditionDisplay,
  Doctor,
  NewAppointmentRequest,
  PatientAppointment,
  TimeSlot,
  User,
} from '../../api/generated';
import { ActiveConditionsExample } from '../../data-examples/active-conditions';
import { AppointmentTimesExample } from '../../data-examples/appointment-times';
import { AvailableDoctorsExample } from '../../data-examples/available-doctors';
import {
  formatAppointmentType,
  formatDate,
  getDateAndTimeTitle,
  getSelectedDateTimeObject,
  TODAY,
} from '../../utils/utils';
import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-appointment-scheduler',
  shadow: false,
})
export class AppointmentScheduler {
  @Prop() api: Api;
  @Prop() user: User;
  @Prop() initialDate: Date = null;

  @State() selectedDate: Date = null;
  @State() selectedTime: string = null;
  @State() selectedAppointmentType: AppointmentType = null;
  @State() selectedDoctor: Doctor = null;
  @State() selectedCondition: ConditionDisplay = null;
  @State() appointmentReason: string = '';
  @State() currentViewMonth: number = TODAY.getMonth();
  @State() currentViewYear: number = TODAY.getFullYear();

  private availableTimes: Array<TimeSlot> = AppointmentTimesExample;
  private availableDoctors: Array<Doctor> = AvailableDoctorsExample;
  private activeConditions: Array<ConditionDisplay> = ActiveConditionsExample;

  componentWillLoad() {
    if (this.initialDate) {
      this.selectedDate = this.initialDate;
    }
  }

  private selectDate = (day: number) => {
    this.selectedDate = new Date(this.currentViewYear, this.currentViewMonth, day);
  };

  private handleTimeChange = (event: Event) => {
    this.selectedTime = (event.target as HTMLSelectElement).value;
  };

  private handleAppointmentTypeChange = (event: Event) => {
    this.selectedAppointmentType = (event.target as HTMLSelectElement).value as AppointmentType;
  };

  private handleDoctorChange = (event: Event) => {
    const doctorId: string = (event.target as HTMLSelectElement).value;
    this.selectedDoctor = this.availableDoctors.find((doctor: Doctor) => doctor.id === doctorId);
  };

  private handleConditionChange = (event: Event) => {
    const conditionId: string = (event.target as HTMLSelectElement).value;
    this.selectedCondition = this.activeConditions.find(
      (condition: ConditionDisplay) => condition.id === conditionId,
    );
  };

  private handleAppointmentReasonChange = (event: Event) => {
    this.appointmentReason = (event.target as HTMLTextAreaElement).value;
  };

  private handleScheduleAppointment = () => {
    const appointmentDateTime: Date = getSelectedDateTimeObject(
      this.selectedDate,
      this.selectedTime,
    );

    const newAppointment: NewAppointmentRequest = {
      patientId: this.user.id,
      appointmentDateTime: appointmentDateTime,
      type: this.selectedAppointmentType,
      conditionId: this.selectedCondition?.id,
      reason: this.appointmentReason,
      doctorId: this.selectedDoctor.id,
    };

    console.log('Request to schedule an appointment:', newAppointment);
    // TODO luky just call this
    // this.api.appointments.requestAppointment({
    //   newAppointmentRequest: {
    //     patientId: this.user.id,
    //     doctorId: this.selectedDoctor,
    //     // appointmentDateTime: ???
    //     type: this.selectedAppointmentType,
    //     reason: this.appointmentReason,
    //   },
    // });
    //
  };

  private resetSelection = () => {
    this.selectedDate = null;
    this.selectedTime = null;
    this.selectedAppointmentType = null;
    this.selectedDoctor = null;
    this.appointmentReason = '';
  };

  private showDetailsPanel = () => {
    return this.selectedDate !== null && this.selectedTime !== null;
  };

  render() {
    const showDetails: boolean = this.showDetailsPanel();

    return (
      <div class="flex h-screen w-full flex-1 flex-col overflow-auto">
        {/* Header */}
        <div class="flex items-center bg-gray-800 px-3 py-1 text-white">
          <md-icon-button
            class="mr-2"
            onClick={showDetails ? () => this.resetSelection() : undefined}
          >
            <md-icon class="text-white">{showDetails ? 'arrow_back' : 'menu'}</md-icon>
          </md-icon-button>
          <h1 class="flex-1 text-center text-xl font-medium">
            {showDetails ? 'Complete your appointment' : 'Schedule an appointment'}
            <a
              class="ml-5 text-sm text-gray-400 hover:underline"
              target="_blank"
              href="https://github.com/Nesquiko/xcastven-xkilian-wac-project"
            >
              Link to repo
            </a>
          </h1>
          <md-icon-button
            class="mr-2"
            onClick={showDetails ? () => this.resetSelection() : undefined}
          >
            <md-icon class="text-white">account_circle</md-icon>
          </md-icon-button>
        </div>

        {/* Content */}
        <div class="mx-auto flex w-full flex-1 flex-col md:flex-row">
          {/* Left panel - Date & Time */}
          <div
            class={`flex flex-col items-center justify-center bg-gray-300 p-6 transition-all duration-600 ease-in-out ${showDetails ? 'w-full md:w-1/2' : 'w-full'}`}
          >
            <xcastven-xkilian-project-date-picker
              selectedDate={this.selectedDate}
              selectDate={this.selectDate}
              currentViewMonth={this.currentViewMonth}
              currentViewYear={this.currentViewYear}
            />

            {/* Time selector */}
            <div class="w-full max-w-lg px-4">
              <md-filled-select
                label="Select a time"
                class="w-full"
                value={this.selectedTime}
                onInput={(e: Event) => this.handleTimeChange(e)}
              >
                {this.availableTimes.map((time: TimeSlot) => (
                  <md-select-option value={time.time} disabled={time.status !== 'available'}>
                    <div slot="headline">{time.time}</div>
                  </md-select-option>
                ))}
              </md-filled-select>
            </div>
          </div>

          {/* Right panel - Details */}
          {showDetails && (
            <div
              class={`m-auto flex w-full max-w-lg transform animate-[slideInFromBottom_0.5s_ease-out] flex-col justify-center p-6 opacity-100 transition-all duration-500 ease-in-out md:w-1/2 md:animate-[slideInFromRight_0.5s_ease-out]`}
            >
              <div class="mb-6">
                {getDateAndTimeTitle(
                  getSelectedDateTimeObject(this.selectedDate, this.selectedTime),
                )}
              </div>

              <div class="mb-6">
                <md-filled-select
                  label="Appointment type"
                  class="w-full"
                  value={this.selectedAppointmentType}
                  onInput={(e: Event) => this.handleAppointmentTypeChange(e)}
                >
                  {Object.values(AppointmentType).map((appointmentType: AppointmentType) => (
                    <md-select-option value={appointmentType}>
                      <div slot="headline">{formatAppointmentType(appointmentType)}</div>
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
                  {this.availableDoctors.map((doctor: Doctor) => (
                    <md-select-option value={doctor.id}>
                      <div slot="headline">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </div>
                    </md-select-option>
                  ))}
                </md-filled-select>
              </div>

              <div class="mb-6">
                <md-filled-select
                  label="Assign this appointment to a condition"
                  class="w-full"
                  value={this.selectedCondition}
                  onInput={(e: Event) => this.handleConditionChange(e)}
                >
                  {this.activeConditions.map((condition: ConditionDisplay) => (
                    <md-select-option value={condition.id}>
                      <div slot="headline">
                        {condition.name} - since {formatDate(condition.start)}
                      </div>
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
  }
}

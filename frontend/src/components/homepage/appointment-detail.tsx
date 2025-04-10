import { AppointmentStatus, DoctorAppointment, instanceOfDoctorAppointment, PatientAppointment } from '../../api/generated';
import { PatientAppointmentDetailExample } from '../../data-examples/patient-appointment-detail';
import { formatDate, formatTime, getAppointmentActions } from '../../utils/utils';
import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-appointment-detail',
  shadow: false,
})
export class AppointmentDetail {
  @Prop() appointmentId: string;
  @Prop() handleResetSelection: () => void;
  @Prop() handleRescheduleAppointment: (appointment: PatientAppointment | DoctorAppointment) => void;
  @Prop() handleCancelAppointment: (appointment: PatientAppointment | DoctorAppointment) => void;

  @State() appointment: PatientAppointment | DoctorAppointment = PatientAppointmentDetailExample;

  private getAppointmentStatusMessage = (appointmentStatus: AppointmentStatus) => {
    switch (appointmentStatus) {
      case 'requested':
        return "This appointment is waiting for a reaction from the Doctor's office.";
      case 'scheduled':
        return '';
      case 'completed':
        return 'This appointment has already been completed.';
      case 'denied':
        return "This appointment has been denied by the Doctor's office.";
      case 'cancelled':
        return 'This appointment has been canceled by you.';
      default:
        return '';
    }
  };

  render() {
    if (!this.appointment) return null;

    return (
      <div class="w-full max-w-md">
        <div class="relative w-full max-w-md">
          <div class="absolute top-1/2 left-0 -translate-x-0 -translate-y-1/2 transform">
            <md-icon-button onClick={this.handleResetSelection}>
              <md-icon class="text-gray-600">arrow_forward</md-icon>
            </md-icon-button>
          </div>

          <h2 class="mb-6 w-full text-center text-xl font-medium text-[#7357be]">Appointment details</h2>
        </div>

        <div class="mb-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
          <div class="mb-1 flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>calendar_month</md-icon>
              Date
            </div>
            <span class="font-medium text-gray-600">{formatDate(this.appointment.appointmentDateTime)}</span>
          </div>

          <div class="mb-1 flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>schedule</md-icon>
              Time
            </div>
            <span class="font-medium text-gray-600">{formatTime(this.appointment.appointmentDateTime)}</span>
          </div>

          <div class="mb-1 flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>format_list_bulleted</md-icon>
              Type
            </div>
            <span class="font-medium text-gray-600">{this.appointment.type}</span>
          </div>

          {instanceOfDoctorAppointment(this.appointment) ? (
            <div class="flex w-full flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-x-2 text-gray-500">
                <md-icon style={{ fontSize: '16px' }}>person</md-icon>
                Patient
              </div>
              <span class="font-medium text-gray-600">
                Dr. {this.appointment.patient.firstName} {this.appointment.patient.lastName}
              </span>
            </div>
          ) : (
            <div class="flex w-full flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-x-2 text-gray-500">
                <md-icon style={{ fontSize: '16px' }}>person</md-icon>
                Doctor
              </div>
              <span class="font-medium text-gray-600">
                Dr. {this.appointment.doctor.firstName} {this.appointment.doctor.lastName}
              </span>
            </div>
          )}

          <div class="flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>info</md-icon>
              Status
            </div>
            <span class="font-medium text-gray-600">{this.appointment.status[0].toUpperCase() + this.appointment.status.slice(1)}</span>
          </div>
        </div>

        <div class="mb-6 max-h-32 w-full max-w-md overflow-y-auto rounded-md bg-gray-200 px-4 py-3">
          <div class="mb-1 flex flex-row items-center gap-x-2 text-gray-500">
            <md-icon style={{ fontSize: '16px' }}>description</md-icon>
            Reason
          </div>
          <p class="ml-1 text-sm font-medium text-wrap text-gray-600">{this.appointment.reason}</p>
        </div>

        {this.appointment.status !== 'scheduled' && <p class="mb-6 text-center text-sm text-wrap text-gray-600">{this.getAppointmentStatusMessage(this.appointment.status)}</p>}

        {getAppointmentActions(this.appointment.status, this.handleRescheduleAppointment, this.handleCancelAppointment)}
      </div>
    );
  }
}

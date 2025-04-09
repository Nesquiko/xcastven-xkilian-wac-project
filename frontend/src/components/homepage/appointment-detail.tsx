import { Component, h, Prop, State } from '@stencil/core';
import { formatDate, formatTime, getAppointmentActions } from '../../utils/utils';
import {
  AppointmentStatus,
  DoctorAppointment,
  instanceOfDoctorAppointment,
  PatientAppointment,
} from '../../api/generated';
import { PatientAppointmentDetailExample } from '../../data-examples/patient-appointment-detail';

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
        return 'This appointment is waiting for a reaction from the Doctor\'s office.';
      case 'scheduled':
        return '';
      case 'completed':
        return 'This appointment has already been completed.';
      case 'denied':
        return 'This appointment has been denied by the Doctor\'s office.';
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
          <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-0">
            <md-icon-button onClick={this.handleResetSelection}>
              <md-icon class="text-gray-600">
                arrow_forward
              </md-icon>
            </md-icon-button>
          </div>

          <h2 class="w-full text-center text-[#7357be] text-xl font-medium mb-6">
            Appointment details
          </h2>
        </div>

        <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
          <div class="w-full flex flex-row justify-between items-center mb-1">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <md-icon
                style={{ fontSize: '16px' }}
              >
                calendar_month
              </md-icon>
              Date
            </div>
            <span class="font-medium text-gray-600">
              {formatDate(this.appointment.appointmentDateTime)}
            </span>
          </div>

          <div class="w-full flex flex-row justify-between items-center mb-1">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <md-icon
                style={{ fontSize: '16px' }}
              >
                schedule
              </md-icon>
              Time
            </div>
            <span class="font-medium text-gray-600">
              {formatTime(this.appointment.appointmentDateTime)}
            </span>
          </div>

          <div class="w-full flex flex-row justify-between items-center mb-1">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <md-icon
                style={{ fontSize: '16px' }}
              >
                format_list_bulleted
              </md-icon>
              Type
            </div>
            <span class="font-medium text-gray-600">
              {this.appointment.type}
            </span>
          </div>

          {instanceOfDoctorAppointment(this.appointment) ? (
            <div class="w-full flex flex-row justify-between items-center">
              <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <md-icon
                style={{ fontSize: '16px' }}
              >
                person
              </md-icon>
                Patient
              </div>
              <span class="font-medium text-gray-600">
                Dr. {this.appointment.patient.firstName}{' '}
                {this.appointment.patient.lastName}
              </span>
            </div>
          ) : (
            <div class="w-full flex flex-row justify-between items-center">
              <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <md-icon
                style={{ fontSize: '16px' }}
              >
                person
              </md-icon>
                Doctor
              </div>
              <span class="font-medium text-gray-600">
                Dr. {this.appointment.doctor.firstName}{' '}
                {this.appointment.doctor.lastName}
              </span>
            </div>
          )}

          <div class="w-full flex flex-row justify-between items-center">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <md-icon
                style={{ fontSize: '16px' }}
              >
                info
              </md-icon>
              Status
            </div>
            <span class="font-medium text-gray-600">
              {this.appointment.status[0].toUpperCase() + this.appointment.status.slice(1)}
            </span>
          </div>
        </div>

        <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6 overflow-y-auto max-h-32">
          <div class="text-gray-500 flex flex-row items-center gap-x-2 mb-1">
            <md-icon
              style={{ fontSize: '16px' }}
            >
              description
            </md-icon>
            Reason
          </div>
          <p class="text-sm font-medium text-gray-600 text-wrap ml-1">
            {this.appointment.reason}
          </p>
        </div>

        {this.appointment.status !== 'scheduled' && (
          <p class="text-sm text-gray-600 text-wrap mb-6 text-center">
            {this.getAppointmentStatusMessage(this.appointment.status)}
          </p>
        )}

        {getAppointmentActions(
          this.appointment.status,
          this.handleRescheduleAppointment,
          this.handleCancelAppointment,
        )}
      </div>
    );
  }
}

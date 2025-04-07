import { Component, h, Prop } from '@stencil/core';
import { formatDate, getAppointmentActions } from '../../utils/utils';
import { Appointment, AppointmentStatusEnum } from '../../api/generated';

@Component({
  tag: 'xcastven-xkilian-project-appointment-detail',
  shadow: false,
})
export class AppointmentDetail {
  @Prop() appointment: Appointment;
  @Prop() handleResetSelection: () => void;
  @Prop() handleRescheduleAppointment: (appointment: Appointment) => void;
  @Prop() handleCancelAppointment: (appointment: Appointment) => void;

  private getAppointmentStatusMessage = (appointmentStatus: AppointmentStatusEnum) => {
    switch (appointmentStatus) {
      case 'requested':
        return 'This appointment is waiting for a reaction from the Doctor\'s office.';
      case 'scheduled':
        return '';
      case 'completed':
        return 'This appointment has already been completed.';
      case 'denied':
        return 'This appointment has been denied by the Doctor\'s office.';
      case 'canceled':
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
              <span class="material-symbols-outlined text-gray-600">
                arrow_forward
              </span>
            </md-icon-button>
          </div>

          <h2 class="w-full text-center text-[#7357be] text-xl font-medium mb-6">
            Appointment details
          </h2>
        </div>

        <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
          <div class="w-full flex flex-row justify-between items-center mb-1">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                calendar_month
              </span>
              Date
            </div>
            <span class="font-medium text-gray-600">
              {formatDate(this.appointment.appointmentDate)}
            </span>
          </div>

          <div class="w-full flex flex-row justify-between items-center mb-1">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                schedule
              </span>
              Time
            </div>
            <span class="font-medium text-gray-600">
              {this.appointment.timeSlot.time}
            </span>
          </div>

          <div class="w-full flex flex-row justify-between items-center mb-1">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                format_list_bulleted
              </span>
              Type
            </div>
            <span class="font-medium text-gray-600">
              {this.appointment.type.displayName}
            </span>
          </div>

          <div class="w-full flex flex-row justify-between items-center">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                person
              </span>
              Doctor
            </div>
            <span class="font-medium text-gray-600">
              Dr. {this.appointment.doctor.firstName}{' '}
              {this.appointment.doctor.lastName}
            </span>
          </div>

          <div class="w-full flex flex-row justify-between items-center">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                info
              </span>
              Status
            </div>
            <span class="font-medium text-gray-600">
              {this.appointment.status[0].toUpperCase() + this.appointment.status.slice(1)}
            </span>
          </div>
        </div>

        <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6 overflow-y-auto max-h-32">
          <div class="text-gray-500 flex flex-row items-center gap-x-2 mb-1">
            <span
              class="material-symbols-outlined"
              style={{ fontSize: '16px' }}
            >
              description
            </span>
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

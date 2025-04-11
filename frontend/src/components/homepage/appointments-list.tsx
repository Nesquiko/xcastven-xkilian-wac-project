import { AppointmentDisplay, User } from '../../api/generated';
import { formatTime, getDateAndTimeTitle } from '../../utils/utils';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-appointments-list',
  shadow: false,
})
export class AppointmentsList {
  @Prop() user: User;
  @Prop() isDoctor: boolean;
  @Prop() appointments: Array<AppointmentDisplay>;
  @Prop() handleSelectAppointment: (appointment: AppointmentDisplay) => void;
  @Prop() noDataMessage: string;

  render() {
    return (
      <div class="w-full overflow-hidden rounded-lg bg-white shadow-sm">
        {this.appointments.length ? (
          this.appointments.map((appointment: AppointmentDisplay, index: number) => {
            return (
              <div
                key={appointment.id}
                class={`flex h-16 w-full cursor-pointer flex-col justify-center border-2 border-transparent px-4 py-2 hover:border-[#9d83c6] ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} ${index === 0 && 'rounded-t-lg'} `}
                onClick={() => this.handleSelectAppointment(appointment)}
              >
                <div class="flex flex-row items-center justify-between">
                  {this.isDoctor ? (
                    <span class="font-medium text-[#7357be]">
                      {formatTime(appointment.appointmentDateTime)}
                    </span>
                  ) : (
                    getDateAndTimeTitle(appointment.appointmentDateTime, 'medium')
                  )}
                  <div class="text-sm font-medium text-gray-600">{appointment.type}</div>
                </div>
                {this.isDoctor ? (
                  <div class="text-sm font-medium text-gray-600">{appointment.patientName}</div>
                ) : (
                  <div class="text-sm font-medium text-gray-600">Dr. {appointment.doctorName}</div>
                )}
              </div>
            );
          })
        ) : (
          <div
            class={`flex h-16 w-full flex-col justify-center border-2 border-transparent bg-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-600`}
          >
            {this.noDataMessage}
          </div>
        )}

        <div class="flex h-12 w-full flex-row items-center justify-between">
          <md-icon-button
            title="View older appointments"
            class="m-1"
            onClick={() => console.log('view older appointments clicked')}
          >
            <md-icon class="text-gray-600">arrow_back</md-icon>
          </md-icon-button>
          <md-icon-button
            title="Schedule an appointment"
            class="m-1 w-20"
            onClick={() => console.log('schedule an appointment')}
          >
            <md-icon class="text-gray-600">calendar_month</md-icon>
            <md-icon class="text-gray-600">add</md-icon>
          </md-icon-button>
          <md-icon-button
            title="View newer appointments"
            class="m-1"
            onClick={() => console.log('view newer appointments clicked')}
          >
            <md-icon class="text-gray-600">arrow_forward</md-icon>
          </md-icon-button>
        </div>
      </div>
    );
  }
}

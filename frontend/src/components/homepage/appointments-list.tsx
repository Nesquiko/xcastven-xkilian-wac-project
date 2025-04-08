import { getDateAndTimeTitle } from '../../utils/utils';
import { Component, h, Prop } from '@stencil/core';
import { AppointmentDisplay } from '../../api/generated';

@Component({
  tag: 'xcastven-xkilian-project-appointments-list',
  shadow: false,
})
export class AppointmentsList {
  private isDoctor: boolean = false /* sessionStorage.getItem("role") */;

  @Prop() appointments: Array<AppointmentDisplay>;
  @Prop() handleSelectAppointment: (appointment: AppointmentDisplay) => void;

  render() {
    return (
      <div class="w-full bg-white rounded-lg overflow-hidden shadow-sm">
        {this.appointments.length ?
          this.appointments.map((appointment: AppointmentDisplay, index: number) => {
            return (
              <div
                key={appointment.id}
                class={`h-16 px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent hover:border-[#9d83c6] cursor-pointer
                  ${index % 2 === 0 ? ' bg-gray-200 ' : ' bg-white '}
                  ${index === 0 && ' rounded-t-lg '}
                `}
                onClick={() => this.handleSelectAppointment(appointment)}
              >
                <div class="flex flex-row justify-between items-center">
                  {getDateAndTimeTitle(
                    appointment.appointmentDateTime,
                    'medium',
                  )}
                  <div class="text-sm font-medium text-gray-600">
                    {appointment.type}
                  </div>
                </div>
                {this.isDoctor ? (
                  <div class="text-sm font-medium text-gray-600">
                    {appointment.patientName}
                  </div>
                ) : (
                  <div class="text-sm font-medium text-gray-600">
                    Dr. {appointment.doctorName}
                  </div>
                )}
              </div>
            )
            },
          ) : (
            <div
              class={`h-16 px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent text-center bg-gray-200 text-sm font-medium text-gray-600`}
            >
              No appointments for this date
            </div>
          )}

        <div class="w-full flex flex-row justify-between items-center h-12">
          <md-icon-button
            title="View older appointments"
            class="m-1"
            onClick={() => console.log('view older appointments clicked')}
          >
            <md-icon class="text-gray-600">
              arrow_back
            </md-icon>
          </md-icon-button>
          <md-icon-button
            title="Schedule an appointment"
            class="m-1 w-20"
            onClick={() => console.log('schedule an appointment')}
          >
            <md-icon class="text-gray-600">
              calendar_month
            </md-icon>
            <md-icon class="text-gray-600">
              add
            </md-icon>
          </md-icon-button>
          <md-icon-button
            title="View newer appointments"
            class="m-1"
            onClick={() => console.log('view newer appointments clicked')}
          >
            <md-icon class="text-gray-600">
              arrow_forward
            </md-icon>
          </md-icon-button>
        </div>
      </div>
    );
  };
}

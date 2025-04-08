import { formatDate, formatDateDelta, getDateAndTimeTitle } from '../../utils/utils';
import { Component, h, Prop, State } from '@stencil/core';
import { AppointmentDisplay, Condition } from '../../api/generated';
import { ConditionDetailExample } from '../../data-examples/condition-detail';

@Component({
  tag: 'xcastven-xkilian-project-condition-detail',
  shadow: false,
})
export class ConditionDetail {
  @Prop() conditionId: string;
  @Prop() handleResetSelection: () => void;
  @Prop() handleSelectAppointment: (appointment: AppointmentDisplay) => void;
  @Prop() handleScheduleAppointmentFromCondition: (condition: Condition) => void;
  @Prop() handleToggleConditionStatus: () => void;

  @State() condition: Condition = ConditionDetailExample;
  @State() expandedConditionId: string;

  private toggleConditionAppointments = (conditionId: string) => {
    this.expandedConditionId = this.expandedConditionId === conditionId ? null : conditionId;
  };

  render() {
    if (!this.condition) return null;

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
            Condition details
          </h2>
        </div>

        <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
          <div class="w-full flex flex-row justify-between items-center mb-1">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <md-icon
                style={{ fontSize: '16px' }}
              >
                edit
              </md-icon>
              Name
            </div>
            <span class="font-medium text-gray-600">
              {this.condition.name}
            </span>
          </div>

          <div class="w-full flex flex-row justify-between items-center mb-1">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <md-icon
                style={{ fontSize: '16px' }}
              >
                line_start_circle
              </md-icon>
              From
            </div>
            <span class="font-medium text-gray-600">
              {formatDate(this.condition.start)}
            </span>
          </div>

          {this.condition.end && (
            <>
              <div class="w-full flex flex-row justify-between items-center mb-1">
                <div class="text-gray-500 flex flex-row items-center gap-x-2">
                  <md-icon
                    style={{ fontSize: '16px' }}
                  >
                    line_end_circle
                  </md-icon>
                  To
                </div>
                <span class="font-medium text-gray-600">
                  {formatDate(this.condition.end)}
                </span>
              </div>

              <div class="w-full flex flex-row justify-between items-center mb-1">
                <div class="text-gray-500 flex flex-row items-center gap-x-2">
                  <md-icon
                    style={{ fontSize: '16px' }}
                  >
                    timer
                  </md-icon>
                  Duration
                </div>
                <span class="font-medium text-gray-600">
                  {formatDateDelta(
                    this.condition.start,
                    this.condition.end,
                  )}
                </span>
              </div>
            </>
          )}

          <div class="w-full flex flex-row justify-between items-center">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <md-icon
                style={{ fontSize: '16px' }}
              >
                {this.condition.end
                  ? 'check_circle'
                  : 'pending'}
              </md-icon>
              Status
            </div>
            <span class="font-medium text-gray-600">
              {this.condition.end ? 'Gone' : 'Ongoing'}
            </span>
          </div>
        </div>

        <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
          <div class="flex flex-row justify-between items-center mb-2">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <md-icon
                style={{ fontSize: '16px' }}
              >
                calendar_month
              </md-icon>
              Appointments
            </div>
            {this.condition.appointments.length > 0 && (
              <md-icon-button
                onClick={() =>
                  this.toggleConditionAppointments(this.condition.id)
                }
                style={{ width: '24px', height: '24px' }}
              >
                <md-icon>
                  {this.expandedConditionId === this.condition.id
                    ? 'expand_less'
                    : 'expand_more'}
                </md-icon>
              </md-icon-button>
            )}
          </div>

          {this.condition.appointments.length <= 0 ? (
            <div class="text-sm font-medium text-gray-600">
              No appointments for this condition
            </div>
          ) : this.expandedConditionId === this.condition.id ? (
            <div class="w-full rounded-md bg-gray-200 overflow-y-auto max-h-28">
              {this.condition.appointments.map(
                (appointment: AppointmentDisplay) => (
                  <div
                    key={appointment.id}
                    class="flex justify-between items-center py-1 px-2 hover:bg-gray-300 rounded cursor-pointer mb-1"
                    onClick={() =>
                      this.handleSelectAppointment(appointment)
                    }
                  >
                    <div class="flex items-center">
                      <md-icon
                        class="text-gray-500 mr-2"
                        style={{ fontSize: '14px' }}
                      >
                        calendar_month
                      </md-icon>
                      {getDateAndTimeTitle(appointment.appointmentDateTime, "medium", "text-sm")}
                    </div>
                    <div class="text-xs text-gray-600 font-medium">
                      {appointment.type}
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div class="text-sm font-medium text-gray-600 ml-2">
              {this.condition.appointments.length} appointment
              {this.condition.appointments.length !== 1 &&
                's'}
            </div>
          )}
        </div>

        <div class="w-full max-w-md flex flex-row justify-between items-center gap-x-3">
          <md-filled-button
            class="w-1/2 rounded-full bg-[#7357be]"
            onClick={this.handleScheduleAppointmentFromCondition}
          >
            Schedule
          </md-filled-button>

          <md-filled-button
            class="w-1/2 rounded-full bg-[#7357be]"
            onClick={this.handleToggleConditionStatus}
          >
            {this.condition.end ? 'Reset as ongoing' : 'Set as gone'}
          </md-filled-button>
        </div>
      </div>
    );
  };
}

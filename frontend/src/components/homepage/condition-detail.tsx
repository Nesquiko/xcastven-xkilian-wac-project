import { Api, ApiError } from '../../api/api';
import { AppointmentDisplay, Condition } from '../../api/generated';
import { formatDate, formatDateDelta, getDateAndTimeTitle } from '../../utils/utils';
import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-condition-detail',
  shadow: false,
})
export class ConditionDetail {
  @Prop() api: Api;
  @Prop() conditionId: string;
  @Prop() handleResetSelection: () => void;
  @Prop() handleSelectAppointment: (appointment: AppointmentDisplay) => void;
  @Prop() handleScheduleAppointmentFromCondition: (condition: Condition) => void;
  @Prop() handleToggleConditionStatus: (condition: Condition) => void;

  @State() condition: Condition;
  @State() expandedConditionId: string;

  async componentWillLoad() {
    try {
      this.condition = await this.api.conditions.conditionDetail({ conditionId: this.conditionId });
    } catch (err) {
      if (!(err instanceof ApiError)) {
        // TODO kili some generic error
        return;
      }

      // TODO this should only return 404 and internal server error, but dont handle the 404, it came in the calendar, so it must be there
    }
  }

  private toggleConditionAppointments = (conditionId: string) => {
    this.expandedConditionId = this.expandedConditionId === conditionId ? null : conditionId;
  };

  render() {
    if (!this.condition) return null;

    return (
      <div class="w-full max-w-md">
        <div class="relative w-full max-w-md">
          <div class="absolute top-1/2 left-0 -translate-x-0 -translate-y-1/2 transform">
            <md-icon-button onClick={this.handleResetSelection}>
              <md-icon class="text-gray-600">arrow_forward</md-icon>
            </md-icon-button>
          </div>

          <h2 class="mb-6 w-full text-center text-xl font-medium text-[#7357be]">
            Condition details
          </h2>
        </div>

        <div class="mb-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
          <div class="mb-1 flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>edit</md-icon>
              Name
            </div>
            <span class="font-medium text-gray-600">{this.condition.name}</span>
          </div>

          <div class="mb-1 flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>line_start_circle</md-icon>
              From
            </div>
            <span class="font-medium text-gray-600">{formatDate(this.condition.start)}</span>
          </div>

          {this.condition.end && (
            <>
              <div class="mb-1 flex w-full flex-row items-center justify-between">
                <div class="flex flex-row items-center gap-x-2 text-gray-500">
                  <md-icon style={{ fontSize: '16px' }}>line_end_circle</md-icon>
                  To
                </div>
                <span class="font-medium text-gray-600">{formatDate(this.condition.end)}</span>
              </div>

              <div class="mb-1 flex w-full flex-row items-center justify-between">
                <div class="flex flex-row items-center gap-x-2 text-gray-500">
                  <md-icon style={{ fontSize: '16px' }}>timer</md-icon>
                  Duration
                </div>
                <span class="font-medium text-gray-600">
                  {formatDateDelta(this.condition.start, this.condition.end)}
                </span>
              </div>
            </>
          )}

          <div class="flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>
                {this.condition.end ? 'check_circle' : 'pending'}
              </md-icon>
              Status
            </div>
            <span class="font-medium text-gray-600">{this.condition.end ? 'Gone' : 'Ongoing'}</span>
          </div>
        </div>

        <div class="mb-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
          <div class="mb-2 flex flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>calendar_month</md-icon>
              Appointments
            </div>
            {this.condition.appointments.length > 0 && (
              <md-icon-button
                onClick={() => this.toggleConditionAppointments(this.condition.id)}
                style={{ width: '24px', height: '24px' }}
              >
                <md-icon>
                  {this.expandedConditionId === this.condition.id ? 'expand_less' : 'expand_more'}
                </md-icon>
              </md-icon-button>
            )}
          </div>

          {this.condition.appointments.length <= 0 ? (
            <div class="text-sm font-medium text-gray-600">No appointments for this condition</div>
          ) : this.expandedConditionId === this.condition.id ? (
            <div class="max-h-28 w-full overflow-y-auto rounded-md bg-gray-200">
              {this.condition.appointments.map((appointment: AppointmentDisplay) => (
                <div
                  key={appointment.id}
                  class="mb-1 flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-gray-300"
                  onClick={() => this.handleSelectAppointment(appointment)}
                >
                  <div class="flex items-center">
                    <md-icon class="mr-2 text-gray-500" style={{ fontSize: '14px' }}>
                      calendar_month
                    </md-icon>
                    {getDateAndTimeTitle(appointment.appointmentDateTime, 'text-sm')}
                  </div>
                  <div class="text-xs font-medium text-gray-600">{appointment.type}</div>
                </div>
              ))}
            </div>
          ) : (
            <div class="ml-2 text-sm font-medium text-gray-600">
              {this.condition.appointments.length} appointment
              {this.condition.appointments.length !== 1 && 's'}
            </div>
          )}
        </div>

        <div class="flex w-full max-w-md flex-row items-center justify-between gap-x-3">
          <md-filled-button
            class="w-1/2 rounded-full bg-[#7357be]"
            onClick={() => this.handleScheduleAppointmentFromCondition(this.condition)}
          >
            Schedule
          </md-filled-button>

          <md-filled-button
            class="w-1/2 rounded-full bg-[#7357be]"
            onClick={() => this.handleToggleConditionStatus(this.condition)}
          >
            {this.condition.end ? 'Reset as ongoing' : 'Set as gone'}
          </md-filled-button>
        </div>
      </div>
    );
  }
}

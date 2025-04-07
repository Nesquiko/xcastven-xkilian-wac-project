import { Condition, formatDate } from '../../utils/utils';
import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-conditions-list',
  shadow: false,
})
export class AppointmentsList {
  @Prop() conditions: Array<Condition>;
  @Prop() handleSelectCondition: (condition: Condition) => void;

  @State() expandedConditionId: string = null;

  render() {
    return (
      <div class="w-full bg-white rounded-lg overflow-hidden shadow-sm">
        {this.conditions.length ?
          this.conditions.map((condition: Condition, index: number) => {
            const isExpanded: boolean =
              this.expandedConditionId && condition.id === this.expandedConditionId;

            return (
              <div key={condition.id}>
                <div
                  class={`px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent hover:border-[#9d83c6] cursor-pointer
                    ${index % 2 === 0 ? ' bg-gray-200 ' : ' bg-white '}
                    ${index === 0 && ' rounded-t-lg '}
                    ${isExpanded ? 'h-auto' : 'h-16'}
                  `}
                  onClick={() => this.handleSelectCondition(condition)}
                >
                  <div class="flex flex-row justify-between items-center">
                    <div class="text-[#7357be] font-medium">
                      {condition.displayName}
                    </div>
                    <div class="flex items-center">
                      {condition.ended ? (
                        <span
                          class="material-symbols-outlined text-gray-500"
                          style={{ fontSize: '16px' }}
                        >
                          check_circle
                        </span>
                      ) : (
                        <span
                          class="material-symbols-outlined text-gray-500"
                          style={{ fontSize: '16px' }}
                        >
                          pending
                        </span>
                      )}
                    </div>
                  </div>
                  <div class="flex flex-row justify-between items-center">
                    <span class="text-sm text-gray-400">
                      From:
                      <span class="text-sm font-medium text-gray-600 ml-2">
                        {formatDate(condition.startDate)}
                      </span>
                    </span>
                    {condition.endDate && (
                      <span class="text-sm text-gray-400">
                        To:
                        <span class="text-sm font-medium text-gray-600 ml-2">
                          {formatDate(condition.endDate)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )},
            ) : (
            <div
              class={`h-16 px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent text-center bg-gray-200 text-sm font-medium text-gray-600`}
            >
              No conditions for this date
            </div>
          )}

        <div class="w-full flex flex-row justify-between items-center h-12">
          <md-icon-button
            title="View older conditions"
            class="m-1"
            onClick={() => console.log('view older conditions clicked')}
          >
            <span class="material-symbols-outlined text-gray-600">
              arrow_back
            </span>
          </md-icon-button>
          <md-icon-button
            title="Register a condition"
            class="m-1 w-20"
            onClick={() => console.log('register a condition')}
          >
            <span class="material-symbols-outlined text-gray-600">
              coronavirus
            </span>
            <span class="material-symbols-outlined text-gray-600">
          add
        </span>
          </md-icon-button>
          <md-icon-button
            title="View newer conditions"
            class="m-1"
            onClick={() => console.log('view newer conditions clicked')}
          >
        <span class="material-symbols-outlined text-gray-600">
          arrow_forward
        </span>
          </md-icon-button>
        </div>
      </div>
    );
  };
}

import { formatDate } from '../../utils/utils';
import { Component, h, Prop, State } from '@stencil/core';
import { ConditionDisplay } from '../../api/generated';

@Component({
  tag: 'xcastven-xkilian-project-conditions-list',
  shadow: false,
})
export class ConditionsList {
  @Prop() conditions: Array<ConditionDisplay>;
  @Prop() handleSelectCondition: (condition: ConditionDisplay) => void;

  @State() expandedConditionId: string = null;

  render() {
    return (
      <div class="w-full bg-white rounded-lg overflow-hidden shadow-sm">
        {this.conditions.length ?
          this.conditions.map((condition: ConditionDisplay, index: number) => {
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
                      {condition.name}
                    </div>
                    <div class="flex items-center">
                      {condition.end ? (
                        <md-icon
                          class="text-gray-500"
                          style={{ fontSize: '16px' }}
                        >
                          check_circle
                        </md-icon>
                      ) : (
                        <md-icon
                          class="text-gray-500"
                          style={{ fontSize: '16px' }}
                        >
                          pending
                        </md-icon>
                      )}
                    </div>
                  </div>
                  <div class="flex flex-row justify-between items-center">
                    <span class="text-sm text-gray-400">
                      From:
                      <span class="text-sm font-medium text-gray-600 ml-2">
                        {formatDate(condition.start)}
                      </span>
                    </span>
                    {condition.end && (
                      <span class="text-sm text-gray-400">
                        To:
                        <span class="text-sm font-medium text-gray-600 ml-2">
                          {formatDate(condition.end)}
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
            <md-icon class="text-gray-600">
              arrow_back
            </md-icon>
          </md-icon-button>
          <md-icon-button
            title="Register a condition"
            class="m-1 w-20"
            onClick={() => console.log('register a condition')}
          >
            <md-icon class="text-gray-600">
              coronavirus
            </md-icon>
            <md-icon class="text-gray-600">
              add
            </md-icon>
          </md-icon-button>
          <md-icon-button
            title="View newer conditions"
            class="m-1"
            onClick={() => console.log('view newer conditions clicked')}
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

import { ConditionDisplay } from '../../api/generated';
import { formatDate, TODAY } from '../../utils/utils';
import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-conditions-list',
  shadow: false,
})
export class ConditionsList {
  @Prop() conditions: Array<ConditionDisplay>;
  @Prop() handleSelectCondition: (condition: ConditionDisplay) => void;
  @Prop() currentDate: Date;

  @State() expandedConditionId: string = null;

  private handleRegisterConditionFromDate = () => {
    const year: number = this.currentDate.getFullYear();
    const month: number = this.currentDate.getMonth() + 1;
    const day: number = this.currentDate.getDate();
    const start = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    window.navigation.navigate(`registerCondition?start=${start}`);
  };

  render() {
    return (
      <div class="w-full overflow-hidden rounded-lg bg-white shadow-sm">
        {this.conditions.length ? (
          this.conditions.map((condition: ConditionDisplay, index: number) => {
            const isExpanded: boolean =
              this.expandedConditionId && condition.id === this.expandedConditionId;

            return (
              <div key={condition.id}>
                <div
                  class={`flex w-full cursor-pointer flex-col justify-center border-2 border-transparent px-4 py-2 hover:border-[#9d83c6] ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} ${index === 0 && 'rounded-t-lg'} ${isExpanded ? 'h-auto' : 'h-16'} `}
                  onClick={() => this.handleSelectCondition(condition)}
                >
                  <div class="flex flex-row items-center justify-between">
                    <div class="font-medium text-[#7357be]">{condition.name}</div>
                    <div class="flex items-center">
                      {condition.end ? (
                        <md-icon class="text-gray-500" style={{ fontSize: '16px' }}>
                          check_circle
                        </md-icon>
                      ) : (
                        <md-icon class="text-gray-500" style={{ fontSize: '16px' }}>
                          pending
                        </md-icon>
                      )}
                    </div>
                  </div>
                  <div class="flex flex-row items-center justify-between">
                    <span class="text-sm text-gray-400">
                      From:
                      <span class="ml-2 text-sm font-medium text-gray-600">
                        {formatDate(condition.start)}
                      </span>
                    </span>
                    {condition.end && (
                      <span class="text-sm text-gray-400">
                        To:
                        <span class="ml-2 text-sm font-medium text-gray-600">
                          {formatDate(condition.end)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            class={`flex h-16 w-full flex-col justify-center border-2 border-transparent bg-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-600`}
          >
            No conditions for this date
          </div>
        )}

        <div class="flex h-12 w-full flex-row items-center justify-between">
          <md-icon-button
            title="View older conditions"
            class="m-1"
            onClick={() => console.log('view older conditions clicked')}
          >
            <md-icon class="text-gray-600">arrow_back</md-icon>
          </md-icon-button>
          <md-icon-button
            title="Register a condition"
            class="m-1 w-20"
            onClick={this.handleRegisterConditionFromDate}
            disabled={this.currentDate > TODAY}
          >
            <md-icon class="text-gray-600">coronavirus</md-icon>
            <md-icon class="text-gray-600">add</md-icon>
          </md-icon-button>
          <md-icon-button
            title="View newer conditions"
            class="m-1"
            onClick={() => console.log('view newer conditions clicked')}
          >
            <md-icon class="text-gray-600">arrow_forward</md-icon>
          </md-icon-button>
        </div>
      </div>
    );
  }
}

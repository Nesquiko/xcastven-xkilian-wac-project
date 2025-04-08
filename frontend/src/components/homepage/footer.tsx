import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-footer',
  shadow: false,
})
export class Footer {
  @Prop() handleScheduleAppointment: () => void;
  @Prop() handleRegisterCondition: () => void;
  @Prop() handleToggleLegendMenu: () => void;

  render() {
    return (
      <div class="w-full px-3 py-1 bg-[#d8c7ed] flex flex-row justify-between h-[48px]">
        <div class="w-10"></div>

        <div class="w-full flex flex-row justify-center items-center gap-x-3">
          <md-text-button
            class="text-sm sm:w-56 w-18 relative pr-3 text-[#7357be]"
            onClick={this.handleScheduleAppointment}
            title="Schedule an appointment"
          >
        <md-icon
          class="absolute top-[10px] left-4"
          style={{ fontSize: '20px' }}
        >
          event
        </md-icon>
            <md-icon
              class="sm:text-transparent absolute top-[10px] left-10"
              style={{ fontSize: '20px' }}
            >
              add
            </md-icon>
            <span class="pl-8 text-center sm:inline hidden">Schedule an appointment</span>
          </md-text-button>

          <md-text-button
            class="text-sm sm:w-48 w-18 relative pr-3 text-[#7357be]"
            onClick={this.handleRegisterCondition}
            title="Register a condition"
          >
            <md-icon
              class="absolute top-[10px] left-4"
              style={{ fontSize: '20px' }}
            >
              coronavirus
            </md-icon>
            <md-icon
              class="sm:text-transparent absolute top-[10px] left-10"
              style={{ fontSize: '20px' }}
            >
              add
            </md-icon>
            <span class="pl-8 text-center sm:inline hidden">Register a condition</span>
          </md-text-button>
        </div>

        <div class="w-10 relative z-98">
          <md-icon-button
            id="legend-button"
            class="mr-2 text-[#7357be]"
            onClick={this.handleToggleLegendMenu}
            title="Legend"
          >
            <md-icon class="text-[#7357be]">more_horiz</md-icon>
          </md-icon-button>
        </div>
      </div>
    );
  };
}

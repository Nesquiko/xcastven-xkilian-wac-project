import { MONTHS, TODAY } from '../../utils/utils';
import { MdMenu } from '@material/web/all';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-header',
  shadow: false,
})
export class Header {
  @Prop() type: 'calendar' | 'account' | 'scheduleAppointment' | 'registerCondition';
  @Prop() currentViewMonth?: number;
  @Prop() currentViewYear?: number;
  @Prop() handlePreviousMonth?: () => void;
  @Prop() handleNextMonth?: () => void;
  @Prop() handleYearChange?: (event: Event) => void;

  private getMonthName = () => {
    return MONTHS[this.currentViewMonth];
  };

  private handleToggleHeaderMenu = () => {
    const menu: MdMenu = document.getElementById('header-md-menu') as MdMenu;
    if (menu) {
      menu.open = !menu.open;
    }
  };

  private getTitle = () => {
    switch (this.type) {
      case 'account':
        return 'Account';
      case 'scheduleAppointment':
        return 'Schedule an appointment';
      case 'registerCondition':
        return 'Register a condition';
      default:
        return '';
    }
  };

  render() {
    const currentYear: number = TODAY.getFullYear();
    const yearOptions: Array<number> = [];
    for (let i: number = -5; i <= 5; i++) {
      yearOptions.push(currentYear + i);
    }

    if (this.type === 'calendar') {
      return (
        <div class="z-10 flex h-[48px] items-center bg-gray-800 px-3 py-1 text-white">
          <span class="relative">
            <md-icon-button id="menu-button" class="mr-2" onClick={this.handleToggleHeaderMenu}>
              <md-icon class="text-white">menu</md-icon>
            </md-icon-button>

            <md-menu
              id="header-md-menu"
              anchor="menu-button"
              style={{ position: 'absolute', zIndex: 90 }}
            >
              <md-menu-item>
                <div slot="headline" class="z-90 flex w-48 flex-row items-center gap-x-2 text-sm">
                  <md-icon style={{ fontSize: '20px' }}>calendar_month</md-icon>
                  <span>Schedule an appointment</span>
                </div>
              </md-menu-item>
              <md-menu-item>
                <div slot="headline" class="z-90 flex w-48 flex-row items-center gap-x-2 text-sm">
                  <md-icon style={{ fontSize: '20px' }}>coronavirus</md-icon>
                  <span>Register a condition</span>
                </div>
              </md-menu-item>
            </md-menu>
          </span>

          <div class="flex flex-1 items-center justify-center gap-x-10">
            <md-icon-button onClick={this.handlePreviousMonth} title="Previous month">
              <md-icon class="text-white">chevron_left</md-icon>
            </md-icon-button>
            <div class="flex w-48 items-center justify-center text-center">
              <span class="font-medium">{this.getMonthName()}</span>
              <span>,</span>
              <select
                class="border-none bg-transparent font-medium"
                onChange={(e: Event) => this.handleYearChange(e)}
              >
                {yearOptions.map(year => (
                  <option
                    value={year.toString()}
                    selected={year === this.currentViewYear}
                    class="text-black hover:text-white"
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <md-icon-button onClick={this.handleNextMonth} title="Next month">
              <md-icon class="text-white">chevron_right</md-icon>
            </md-icon-button>
          </div>

          <md-icon-button onClick={() => window.navigation.navigate('account')}>
            <md-icon class="text-white">account_circle</md-icon>
          </md-icon-button>
        </div>
      );
    } else {
      return (
        <div class="z-10 flex h-[48px] items-center bg-gray-800 px-3 py-1 text-white">
          <span class="relative">
            <md-icon-button id="menu-button" class="mr-2" onClick={this.handleToggleHeaderMenu}>
              <md-icon class="text-white">menu</md-icon>
            </md-icon-button>

            <md-menu
              id="header-md-menu"
              anchor="menu-button"
              style={{ position: 'absolute', zIndex: 90 }}
            >
              <md-menu-item>
                <div slot="headline" class="z-90 flex w-48 flex-row items-center gap-x-2 text-sm">
                  <md-icon style={{ fontSize: '20px' }}>calendar_month</md-icon>
                  <span>Schedule an appointment</span>
                </div>
              </md-menu-item>
              <md-menu-item>
                <div slot="headline" class="z-90 flex w-48 flex-row items-center gap-x-2 text-sm">
                  <md-icon style={{ fontSize: '20px' }}>coronavirus</md-icon>
                  <span>Register a condition</span>
                </div>
              </md-menu-item>
            </md-menu>
          </span>

          <h1 class="w-full text-center text-xl font-medium text-white">{this.getTitle()}</h1>

          <md-icon-button onClick={() => window.navigation.navigate('account')}>
            <md-icon class="text-white">account_circle</md-icon>
          </md-icon-button>
        </div>
      );
    }
  }
}

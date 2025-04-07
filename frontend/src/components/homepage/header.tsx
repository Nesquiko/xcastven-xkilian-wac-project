import { Component, h, Prop } from '@stencil/core';
import { MdMenu } from '@material/web/all';
import { MONTHS, TODAY } from '../../utils/utils';

@Component({
  tag: 'xcastven-xkilian-project-header',
  shadow: false,
})
export class Header {
  @Prop() currentViewMonth: number;
  @Prop() currentViewYear: number;
  @Prop() handlePreviousMonth: () => void;
  @Prop() handleNextMonth: () => void;
  @Prop() handleYearChange: (event: Event) => void;

  private getMonthName = () => {
    return MONTHS[this.currentViewMonth];
  };

  private handleToggleHeaderMenu = () => {
    const menu: MdMenu = document.getElementById('header-md-menu') as MdMenu;
    if (menu) {
      menu.open = !menu.open;
    }
  };

  render () {
    const currentYear: number = TODAY.getFullYear();
    const yearOptions: Array<number> = [];
    for (let i: number = -5; i <= 5; i++) {
      yearOptions.push(currentYear + i);
    }

    return (
      <div class="bg-gray-800 flex items-center px-3 py-1 text-white h-[48px]">
          <span class="relative">
            <md-icon-button
              id="menu-button"
              class="mr-2"
              onClick={this.handleToggleHeaderMenu}
            >
              <span class="material-symbols-outlined text-white">menu</span>
            </md-icon-button>

            <md-menu id="header-md-menu" anchor="menu-button" style={{ position: 'absolute', zIndex: 90 }}>
              <md-menu-item>
                <div
                  slot="headline"
                  class="text-sm w-48 flex flex-row items-center gap-x-2 z-90"
                >
                  <span
                    class="material-symbols-outlined"
                    style={{ fontSize: '20px' }}
                  >
                    calendar_month
                  </span>
                  <span>Schedule an appointment</span>
                </div>
              </md-menu-item>
              <md-menu-item>
                <div
                  slot="headline"
                  class="text-sm w-48 flex flex-row items-center gap-x-2 z-90"
                >
                  <span
                    class="material-symbols-outlined"
                    style={{ fontSize: '20px' }}
                  >
                    coronavirus
                  </span>
                  <span>Register a condition</span>
                </div>
              </md-menu-item>
            </md-menu>
          </span>

        <div class="flex flex-1 items-center justify-center gap-x-10">
          <md-icon-button
            onClick={this.handlePreviousMonth}
            title="Previous month"
          >
            <span class="material-symbols-outlined text-white">
              chevron_left
            </span>
          </md-icon-button>
          <div class="text-center flex items-center w-48 justify-center">
            <span class="font-medium">{this.getMonthName()}</span>
            <span>,</span>
            <select
              class="bg-transparent border-none font-medium"
              onChange={(e: Event) => this.handleYearChange(e)}
            >
              {yearOptions.map((year) => (
                <option
                  value={year.toString()}
                  selected={year === this.currentViewYear}
                  class="hover:text-white text-black"
                >
                  {year}
                </option>
              ))}
            </select>
          </div>
          <md-icon-button
            onClick={this.handleNextMonth}
            title="Next month"
          >
              <span class="material-symbols-outlined text-white">
                chevron_right
              </span>
          </md-icon-button>
        </div>

        <md-icon-button onClick={() => console.log('account clicked')}>
            <span class="material-symbols-outlined text-white">
              account_circle
            </span>
        </md-icon-button>
      </div>
    );
  };
}


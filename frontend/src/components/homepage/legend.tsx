import { Component, h, Prop } from '@stencil/core';
import { ConditionOrderColors } from '../../utils/utils';

@Component({
  tag: 'xcastven-xkilian-project-legend',
  shadow: false,
})
export class Legend {
  @Prop() handleResetSelection: () => void;

  render() {
    return (
      <div class="w-full max-w-md">
        <div class="relative w-full max-w-md">
          <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-0">
            <md-icon-button onClick={this.handleResetSelection}>
              <span class="material-symbols-outlined text-gray-600">
                arrow_forward
              </span>
            </md-icon-button>
          </div>

          <h2 class="w-full text-center text-[#7357be] text-xl font-medium mb-6">
            Calendar Legend
          </h2>
        </div>

        <div class="flex flex-col gap-y-1 bg-gray-200 rounded-md p-2">
          <div
            slot="headline"
            class="px-2 py-1 text-sm w-full flex flex-row items-center justify-between gap-x-2 z-98 border-2 border-transparent hover:border-[#9d83c6] rounded-md"
          >
            <span class="text-gray-600 font-medium">Schedule-able day</span>
            <div class="bg-[#d8c7ed] h-6 w-6 rounded-full border-2 border-white" />
          </div>
          <div
            slot="headline"
            class="px-2 py-1 text-sm w-full flex flex-row items-center justify-between gap-x-2 z-98 border-2 border-transparent hover:border-[#9d83c6] rounded-md"
          >
            <span class="text-gray-600 font-medium">Non schedule-able day</span>
            <div class="bg-white h-6 w-6 rounded-full border-2 border-white" />
          </div>
          <div
            slot="headline"
            class="px-2 py-1 text-sm w-full flex flex-row items-center justify-between gap-x-2 z-98 border-2 border-transparent hover:border-[#9d83c6] rounded-md"
          >
            <span class="text-gray-600 font-medium">Other month's day</span>
            <div class="bg-gray-200 h-6 w-6 rounded-full border-2 border-white" />
          </div>
          <div
            slot="headline"
            class="px-2 py-1 text-sm w-full flex flex-row items-center justify-between gap-x-2 z-98 border-2 border-transparent hover:border-[#9d83c6] rounded-md"
          >
            <span class="text-gray-600 font-medium">Scheduled appointment</span>
            <div class="bg-[#7357be] h-6 w-6 rounded-full border-2 border-white" />
          </div>
          <div
            slot="headline"
            class="px-2 py-1 text-sm w-full flex flex-row items-center justify-between gap-x-2 z-98 border-2 border-transparent hover:border-[#9d83c6] rounded-md"
          >
            <span class="text-gray-600 font-medium">Requested appointment</span>
            <div class="bg-[#9d83c6] h-6 w-6 rounded-full border-2 border-white" />
          </div>
          <div
            slot="headline"
            class="px-2 py-1 text-sm w-full flex flex-row items-center justify-between gap-x-2 z-98 border-2 border-transparent hover:border-[#9d83c6] rounded-md"
          >
            <span class="text-gray-600 font-medium">Completed appointment</span>
            <div class="bg-[#2E8B57] h-6 w-6 rounded-full border-2 border-white" />
          </div>
          <div
            slot="headline"
            class="px-2 py-1 text-sm w-full flex flex-row items-center justify-between gap-x-2 z-98 border-2 border-transparent hover:border-[#9d83c6] rounded-md"
          >
            <span class="text-gray-600 font-medium">Canceled appointment</span>
            <div class="bg-[#F08080] h-6 w-6 rounded-full border-2 border-white" />
          </div>
          <div
            slot="headline"
            class="px-2 py-1 text-sm w-full flex flex-row items-center justify-between gap-x-2 z-98 border-2 border-transparent hover:border-[#9d83c6] rounded-md"
          >
            <span class="text-gray-600 font-medium">Denied appointment</span>
            <div class="bg-[#4f4f4f] h-6 w-6 rounded-full border-2 border-white" />
          </div>
          <div
            slot="headline"
            class="px-2 py-1 text-sm w-full flex flex-col items-center justify-between gap-y-2 z-98 border-2 border-transparent hover:border-[#9d83c6] rounded-md"
          >
            <span class="w-full text-left text-gray-600 font-medium">Conditions</span>
            <div
              class="flex w-full h-8 rounded-full overflow-hidden border-2 border-white"
            >
              {ConditionOrderColors.map((color: string) => (
                <div
                  class="flex-grow"
                  style={{
                    backgroundColor: color,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
}

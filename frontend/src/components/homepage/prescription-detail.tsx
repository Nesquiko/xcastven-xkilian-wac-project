import { Component, Prop, State, h } from '@stencil/core';
import { Prescription } from '../../api/generated';
import { PrescriptionDetailExample } from '../../data-examples/prescription-detail';
import { formatDate, formatDateDelta } from '../../utils/utils';

@Component({
  tag: 'xcastven-xkilian-project-prescription-detail',
  shadow: false,
})
export class PrescriptionDetail {
  @Prop() prescriptionId: string;
  @Prop() handleResetSelection: () => void;

  @State() prescription: Prescription = PrescriptionDetailExample;

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
            Prescription details
          </h2>
        </div>

        <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
          <div class="w-full flex flex-row justify-between items-center mb-1">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                medication
              </span>
              Name
            </div>
            <span class="font-medium text-gray-600">
              {this.prescription.name}
            </span>
          </div>

          <div class="w-full flex flex-row justify-between items-center mb-1">
            <div class="text-gray-500 flex flex-row items-center gap-x-2">
              <span
                class="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                line_start_circle
              </span>
              From
            </div>
            <span class="font-medium text-gray-600">
              {formatDate(this.prescription.start)}
            </span>
          </div>

          {this.prescription.end && (
            <>
              <div class="w-full flex flex-row justify-between items-center mb-1">
                <div class="text-gray-500 flex flex-row items-center gap-x-2">
                  <span
                    class="material-symbols-outlined"
                    style={{ fontSize: '16px' }}
                  >
                    line_end_circle
                  </span>
                  To
                </div>
                <span class="font-medium text-gray-600">
                  {formatDate(this.prescription.end)}
                </span>
              </div>

              <div class="w-full flex flex-row justify-between items-center mb-1">
                <div class="text-gray-500 flex flex-row items-center gap-x-2">
                  <span
                    class="material-symbols-outlined"
                    style={{ fontSize: '16px' }}
                  >
                    timer
                  </span>
                  Duration
                </div>
                <span class="font-medium text-gray-600">
                  {formatDateDelta(
                    this.prescription.start,
                    this.prescription.end,
                  )}
                </span>
              </div>
            </>
          )}
        </div>

        <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6 overflow-y-auto max-h-32">
          <div class="text-gray-500 flex flex-row items-center gap-x-2">
            <span
              class="material-symbols-outlined"
              style={{ fontSize: '16px' }}
            >
              description
            </span>
            Doctor's note
          </div>
          {this.prescription.doctorsNote && (
            <p class="text-sm font-medium text-gray-600 text-wrap mt-1 ml-1">
              {this.prescription.doctorsNote}
            </p>
          )}
        </div>
      </div>
    );
  }
}

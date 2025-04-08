import { formatDate, TODAY } from '../../utils/utils';
import { Component, h, Prop } from '@stencil/core';
import { PrescriptionDisplay } from '../../api/generated';

@Component({
  tag: 'xcastven-xkilian-project-prescriptions-list',
  shadow: false,
})
export class PrescriptionsList {
  @Prop() prescriptions: Array<PrescriptionDisplay>;
  @Prop() handleSelectPrescription: (prescription: PrescriptionDisplay) => void;

  render() {
    return (
      <div class="w-full bg-white rounded-lg overflow-hidden shadow-sm">
        {this.prescriptions.length ?
          this.prescriptions.map((prescription: PrescriptionDisplay, index: number) => {
            return (
              <div key={prescription.id}>
                <div
                  class={`px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent hover:border-[#9d83c6] cursor-pointer
                    ${index % 2 === 0 ? ' bg-gray-200 ' : ' bg-white '}
                    ${index === 0 && ' rounded-t-lg '}
                  `}
                  onClick={() => this.handleSelectPrescription(prescription)}
                >
                  <div class="flex flex-row justify-between items-center">
                    <div class="text-[#7357be] font-medium">
                      {prescription.name}
                    </div>
                    <div class="flex items-center">
                      {TODAY.getTime() > prescription.end.getTime() ? (
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
                        {formatDate(prescription.start)}
                      </span>
                    </span>
                    {prescription.end && (
                      <span class="text-sm text-gray-400">
                        To:
                        <span class="text-sm font-medium text-gray-600 ml-2">
                          {formatDate(prescription.end)}
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
              No prescriptions for this date
            </div>
          )}

        <div class="w-full flex flex-row justify-between items-center h-12">
          <md-icon-button
            title="View older prescriptions"
            class="m-1"
            onClick={() => console.log('view older prescriptions clicked')}
          >
            <md-icon class="text-gray-600">
              arrow_back
            </md-icon>
          </md-icon-button>
          <md-icon-button
            title="View newer prescriptions"
            class="m-1"
            onClick={() => console.log('view newer prescriptions clicked')}
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

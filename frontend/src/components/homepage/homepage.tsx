import { Component, h, State } from '@stencil/core';
import { Appointment, Illness, TimeSlot } from '../../lib/types';
import { formatDate, getDateAndTimeTitle } from '../../utils/utils';

const data = {
  appointments: [
    {
      id: "1",
      timeSlot: {
        time: "7:00",
        status: "unavailable",
      } satisfies TimeSlot,
      date: new Date(),
      type: {
        id: "1",
        displayName: "Check-Up",
      },
      doctor: {
        id: "1",
        displayName: "Dr. John Doe",
        specialty: "Urologist"
      },
      illness: "Flu",
      status: "scheduled",
      reason: "Feeling unwell",
      facilities: [],
      equipment: [],
      medicine: [],
    },
    {
      id: "2",
      timeSlot: {
        time: "8:00",
        status: "unavailable",
      } satisfies TimeSlot,
      date: new Date(),
      type: {
        id: "1",
        displayName: "Check-Up",
      },
      doctor: {
        id: "1",
        displayName: "Dr. John Doe",
        specialty: "Urologist"
      },
      illness: "Flu",
      status: "scheduled",
      reason: "Feeling unwell",
      facilities: [],
      equipment: [],
      medicine: [],
    },
    {
      id: "3",
      timeSlot: {
        time: "9:00",
        status: "unavailable",
      } satisfies TimeSlot,
      date: new Date(),
      type: {
        id: "1",
        displayName: "Check-Up",
      },
      doctor: {
        id: "1",
        displayName: "Dr. John Doe",
        specialty: "Urologist"
      },
      illness: "Flu",
      status: "scheduled",
      reason: "Feeling unwell",
      facilities: [],
      equipment: [],
      medicine: [],
    },
    {
      id: "4",
      timeSlot: {
        time: "10:00",
        status: "unavailable",
      } satisfies TimeSlot,
      date: new Date(),
      type: {
        id: "1",
        displayName: "Check-Up",
      },
      doctor: {
        id: "1",
        displayName: "Dr. John Doe",
        specialty: "Urologist"
      },
      illness: "Flu",
      status: "scheduled",
      reason: "Feeling unwell",
      facilities: [],
      equipment: [],
      medicine: [],
    },
    {
      id: "5",
      timeSlot: {
        time: "11:00",
        status: "unavailable",
      } satisfies TimeSlot,
      date: new Date(),
      type: {
        id: "1",
        displayName: "Check-Up",
      },
      doctor: {
        id: "1",
        displayName: "Dr. John Doe",
        specialty: "Urologist"
      },
      illness: "Flu",
      status: "scheduled",
      reason: "Feeling unwell",
      facilities: [],
      equipment: [],
      medicine: [],
    }
  ] satisfies Array<Appointment>,
  illnesses: [
    {
      id: "1",
      displayName: "Flu",
      startDate: new Date(),
      ended: false,
    },
    {
      id: "2",
      displayName: "Broken leg",
      startDate: new Date(),
      ended: false,
    },
    {
      id: "3",
      displayName: "ACL tear",
      startDate: new Date(),
      ended: false,
    },
    {
      id: "4",
      displayName: "Migraine",
      startDate: new Date(),
      ended: false,
    },
    {
      id: "5",
      displayName: "Headache",
      startDate: new Date(),
      ended: false,
    },
  ] satisfies Array<Illness>,
};

@Component({
  tag: 'xcastven-xkilian-project-home-page',
  shadow: false,
})
export class Homepage {
  @State() selectedAppointment: Appointment = null;
  @State() selectedIllness: Illness = null;

  private appointments: Array<Appointment> = data.appointments;
  private illnesses: Array<Illness> = data.illnesses;

  render() {
    return (
        <div class="flex h-screen flex-col w-full flex-1 overflow-auto">
          {/* Header */}
          <div class="bg-gray-800 flex items-center p-3 text-white">
            <md-icon-button
              onClick={() => console.log("back clicked")}
            >
              <span class="material-symbols-outlined text-white">
                arrow_back
              </span>
            </md-icon-button>
            <h1 class="flex-1 text-center text-xl font-medium">
              Homepage
            </h1>
            <md-icon-button
              onClick={() => console.log("account clicked")}
            >
              <span class="material-symbols-outlined text-white">
                account_circle
              </span>
            </md-icon-button>
          </div>

          {/* Content */}
          <div class="flex flex-1 flex-col md:flex-row mx-auto w-full">
            {/* Left panel - Appointments */}
            <div
              class="flex-1 h-full bg-gray-300 m-auto p-6 md:w-1/2 w-full flex flex-col items-center justify-center"
            >
              <div class="flex flex-col gap-y-2 w-full justify-center items-center">
                <h4 class="w-full max-w-md text-left font-medium text-gray-600">
                  My upcoming appointments
                </h4>
                <md-list class="w-full max-w-md">
                  {this.appointments.map((appointment: Appointment, index: number) => (
                    <md-list-item
                      key={appointment.id}
                      class={`flex flex-col gap-y-1 w-full border border-2 border-transparent hover:border-gray-500
                      ${index % 2 === 0 ? " bg-gray-100 " : " bg-gray-200 "}
                    `}
                    >
                      <div class="flex flex-row justify-between items-center">
                        {getDateAndTimeTitle(appointment.date, appointment.timeSlot.time, "text-sm text-left")}
                        <span class="text-sm font-medium text-gray-600">{appointment.type.displayName}</span>
                      </div>
                      <span class="text-sm font-medium text-gray-600">{appointment.doctor.displayName}</span>
                    </md-list-item>
                  ))}
                  <div class="w-full flex flex-row justify-between items-center bg-gray-200">
                    <md-icon-button
                      class="m-1"
                      onClick={() => console.log('view older clicked')}
                    >
                      <span class="material-symbols-outlined text-gray-600">
                        arrow_back
                      </span>
                    </md-icon-button>
                    <md-icon-button
                      class="m-1"
                      onClick={() => console.log('view newer clicked')}
                    >
                      <span class="material-symbols-outlined text-gray-600">
                        arrow_forward
                      </span>
                    </md-icon-button>
                  </div>
                </md-list>
              </div>
            </div>

            {/* Right panel - Illnesses */}
            <div
              class="flex-1 h-full m-auto p-6 md:w-1/2 w-full flex flex-col items-center justify-center"
            >
              <div class="flex flex-col gap-y-2 w-full justify-center items-center max-w-md">
                <h4 class="w-full max-w-md text-left font-medium text-gray-600">
                  My ongoing illnesses
                </h4>
                <md-list class="w-full max-w-md">
                  {this.illnesses.map((illness: Illness, index: number) => (
                    <md-list-item
                      key={illness.id}
                      class={`flex flex-col gap-y-1 w-full border border-2 border-transparent hover:border-gray-500
                    ${index % 2 === 0 ? " bg-gray-100 " : " bg-gray-200 "}
                  `}
                    >
                      <div class="flex flex-row justify-between items-center">
                        <span class="text-sm font-medium text-[#7357be]">{illness.displayName}</span>
                        <span class="text-sm font-medium text-gray-600">{illness.ended ? "Ongoing" : "Gone"}</span>
                      </div>
                      <span class="text-sm text-gray-400">
                        From:
                        <span class="text-sm font-medium text-gray-600 ml-2">{formatDate(illness.startDate)}</span>
                      </span>
                      {illness.endDate && (
                        <span class="text-sm font-medium text-gray-600">{illness.endDate}</span>
                      )}
                    </md-list-item>
                  ))}
                  <div class="w-full flex flex-row justify-between items-center bg-gray-200">
                    <md-icon-button
                      class="m-1"
                      onClick={() => console.log('view older clicked')}
                    >
                    <span class="material-symbols-outlined text-gray-600">
                      arrow_back
                    </span>
                    </md-icon-button>
                    <md-icon-button
                      class="m-1"
                      onClick={() => console.log('view newer clicked')}
                    >
                    <span class="material-symbols-outlined text-gray-600">
                      arrow_forward
                    </span>
                    </md-icon-button>
                  </div>
                </md-list>
              </div>
            </div>
          </div>
        </div>
    );
  };
}

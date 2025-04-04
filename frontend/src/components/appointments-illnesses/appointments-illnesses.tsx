import { Component, h, State } from '@stencil/core';
import { formatDate, formatDateDelta, getDateAndTimeTitle } from '../../utils/utils';
import { MdMenu } from '@material/web/all';
import { Appointment, TimeSlot } from '../../api/generated';

type Illness = {
  id: string;
  displayName: string;
  startDate: Date;
  endDate?: Date;
  ended: boolean;
  appointments: Array<Appointment>;
};

const data = {
  appointments: [
    {
      id: 'appt-1',
      timeSlot: {
        time: '7:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'scheduled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-2',
      timeSlot: {
        time: '8:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(),
      type: {
        id: '100',
        displayName: 'Consultation',
      },
      doctor: {
        id: '1542523124',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'email@smith.sk',
        specialization: 'general_practitioner',
      },
      illness: 'Flu',
      status: 'scheduled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-3',
      timeSlot: {
        time: '11:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'scheduled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-4',
      timeSlot: {
        time: '13:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'scheduled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
    {
      id: 'appt-5',
      timeSlot: {
        time: '10:00',
        status: 'unavailable',
      } satisfies TimeSlot,
      appointmentDate: new Date(),
      type: {
        id: '1',
        displayName: 'Check-Up',
      },
      doctor: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'email@email.sk',
        specialization: 'gastroenterologist',
      },
      illness: 'Flu',
      status: 'scheduled',
      reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
      facilities: [],
      equipment: [],
      medicine: [],
      patient: {
        id: '100',
        email: 'email@email.sk',
        firstName: 'Jozef',
        lastName: 'Jozkovic',
      },
    } satisfies Appointment,
  ] satisfies Array<Appointment>,
  illnesses: [
    {
      id: 'illn-1',
      displayName: 'Flu',
      startDate: new Date(),
      endDate: new Date(),
      ended: true,
      appointments: [
        {
          id: 'appt-1',
          timeSlot: {
            time: '7:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
        {
          id: 'appt-1',
          timeSlot: {
            time: '9:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '9',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
        {
          id: 'appt-1',
          timeSlot: {
            time: '11:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
        {
          id: 'appt-1',
          timeSlot: {
            time: '11:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
        {
          id: 'appt-1',
          timeSlot: {
            time: '11:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
        {
          id: 'appt-1',
          timeSlot: {
            time: '11:00',
            status: 'unavailable',
          } satisfies TimeSlot,
          appointmentDate: new Date(),
          type: {
            id: '1',
            displayName: 'Check-Up',
          },
          doctor: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'doctor@doctor.sk',
            specialization: 'orthopedist',
          },
          illness: 'Flu',
          status: 'scheduled',
          reason: 'Feeling unwell Feeling unwell Feeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwellFeeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell Feeling unwell ',
          facilities: [],
          equipment: [],
          medicine: [],
          patient: {
            id: 'gsdnga armsd',
            firstName: 'Jozef',
            lastName: 'Jozovic',
            email: 'jozef@jozovic.sk',
          },
        } satisfies Appointment,
      ] satisfies Array<Appointment>,
    },
    {
      id: 'illn-2',
      displayName: 'Broken leg',
      startDate: new Date(),
      endDate: new Date(),
      ended: true,
      appointments: [],
    },
    {
      id: 'illn-3',
      displayName: 'ACL tear',
      startDate: new Date(),
      endDate: new Date(),
      ended: true,
      appointments: [],
    },
    {
      id: 'illn-4',
      displayName: 'Migraine',
      startDate: new Date(),
      ended: false,
      appointments: [],
    },
    {
      id: 'illn-5',
      displayName: 'Headache',
      startDate: new Date(),
      ended: false,
      appointments: [],
    },
  ] satisfies Array<Illness>,
};

@Component({
  tag: 'xcastven-xkilian-project-appointments-illnesses',
  shadow: false,
})
export class AppointmentsIllnesses {
  @State() activeTab: number = 0;
  @State() selectedAppointment: Appointment = null;
  @State() selectedIllness: Illness = null;
  @State() expandedIllnessId: string = null;

  private appointments: Array<Appointment> = data.appointments;
  private illnesses: Array<Illness> = data.illnesses;

  private handleTabChange = (event) => {
    const tabBar = event.target;
    this.activeTab = tabBar.activeTabIndex;
  };

  private showDetailsPanel = () => {
    return this.selectedAppointment !== null || this.selectedIllness !== null;
  };

  private handleSelectAppointment = (appointment: Appointment) => {
    this.selectedAppointment = appointment;
    this.selectedIllness = null;
  };

  private handleSelectIllness = (illness: Illness) => {
    this.selectedIllness = illness;
    this.selectedAppointment = null;
  };

  private toggleIllnessAppointments = (illnessId: string) => {
    this.expandedIllnessId = this.expandedIllnessId === illnessId ? null : illnessId;
  };

  private resetSelection = () => {
    this.selectedAppointment = null;
    this.selectedIllness = null;
  };

  private handleRescheduleAppointment = () => {
    console.log('Re-schedule appointment:', this.selectedAppointment);
  };

  private handleCancelAppointment = () => {
    console.log('Cancel appointment:', this.selectedAppointment);
  };

  private handleScheduleAppointmentFromIllness = () => {
    console.log('Schedule an appointment from illness:', this.selectedIllness);
  };

  private handleToggleIllnessStatus = () => {
    this.selectedIllness = {
      ...this.selectedIllness,
      ended: !this.selectedIllness.ended,
      endDate: new Date(),
    };
  };

  private handleToggleMenu = () => {
    const menu: MdMenu = document.querySelector('md-menu');
    if (menu) {
      menu.open = !menu.open;
    }
  };

  render() {
    const showDetails = this.showDetailsPanel();

    return (
      <div class="flex h-screen flex-col w-full flex-1 overflow-x-hidden">
        {/* Header */}
        <div class="bg-gray-800 flex items-center px-3 py-1 text-white">
          <span class="relative">
            <md-icon-button
              id="menu-button"
              class="mr-2"
              onClick={this.handleToggleMenu}
            >
              <span class="material-symbols-outlined text-white">menu</span>
            </md-icon-button>

            <md-menu anchor="menu-button">
              <md-menu-item>
                <div
                  slot="headline"
                  class="text-sm w-48 flex flex-row items-center gap-x-2"
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
                  class="text-sm w-48 flex flex-row items-center gap-x-2"
                >
                  <span
                    class="material-symbols-outlined"
                    style={{ fontSize: '20px' }}
                  >
                    coronavirus
                  </span>
                  <span>Register an illness</span>
                </div>
              </md-menu-item>
            </md-menu>
          </span>

          <h1 class="flex-1 text-center text-xl font-medium">Appointments & Illnesses</h1>

          <md-icon-button onClick={() => console.log('account clicked')}>
            <span class="material-symbols-outlined text-white">
              account_circle
            </span>
          </md-icon-button>
        </div>

        {/* Content */}
        <div class="flex flex-1 flex-col md:flex-row mx-auto w-full">
          <div class="flex-1 h-full bg-gray-300 m-auto p-6 w-full flex flex-col items-center justify-center">
            <div class="flex flex-col gap-y-2 w-full justify-center items-center">
              {/* Tabs */}
              <div class="w-full max-w-md bg-gray-100 rounded-lg overflow-hidden">
                <md-tabs
                  class="w-full"
                  onchange={(e) => this.handleTabChange(e)}
                >
                  <md-primary-tab class="w-1/2 px-4">
                    <span class="w-full">My appointments</span>
                  </md-primary-tab>
                  <md-primary-tab class="w-1/2 px-4">
                    <span class="w-full">My illnesses</span>
                  </md-primary-tab>
                </md-tabs>
              </div>

              {/* Appointments Tab Content */}
              <div
                class={`w-full max-w-md ${
                  this.activeTab === 0 ? 'block' : 'hidden'
                }`}
              >
                <div class="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  {this.appointments.map(
                    (appointment: Appointment, index: number) => {
                      const isSelected: boolean =
                        this.selectedAppointment &&
                        appointment.id === this.selectedAppointment.id;

                      return (
                        <div
                          key={appointment.id}
                          class={`h-16 px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent hover:border-[#9d83c6] cursor-pointer
                            ${index % 2 === 0 ? ' bg-gray-200 ' : ' bg-white '}
                            ${index === 0 && ' rounded-t-lg '}
                          `}
                          onClick={() => this.handleSelectAppointment(appointment)}
                          style={isSelected ? { borderColor: '#7357be' } : {}}
                        >
                          <div class="flex flex-row justify-between items-center">
                            {getDateAndTimeTitle(
                              appointment.appointmentDate,
                              appointment.timeSlot.time,
                              'medium',
                            )}
                            <div class="text-sm font-medium text-gray-600">
                              {appointment.type.displayName}
                            </div>
                          </div>
                          <div class="text-sm font-medium text-gray-600">
                            Dr. {appointment.doctor.firstName}{' '}
                            {appointment.doctor.lastName}
                          </div>
                        </div>
                      );
                    },
                  )}

                  <div class="w-full flex flex-row justify-between items-center h-12">
                    <md-icon-button
                      title="View older appointments"
                      class="m-1"
                      onClick={() => console.log('view older appointments clicked')}
                    >
                      <span class="material-symbols-outlined text-gray-600">
                        arrow_back
                      </span>
                    </md-icon-button>
                    <md-icon-button
                      title="Schedule an appointment"
                      class="m-1 w-20"
                      onClick={() => console.log('schedule an appointment')}
                    >
                      <span class="material-symbols-outlined text-gray-600">
                        calendar_month
                      </span>
                      <span class="material-symbols-outlined text-gray-600">
                        add
                      </span>
                    </md-icon-button>
                    <md-icon-button
                      title="View newer appointments"
                      class="m-1"
                      onClick={() => console.log('view newer appointments clicked')}
                    >
                      <span class="material-symbols-outlined text-gray-600">
                        arrow_forward
                      </span>
                    </md-icon-button>
                  </div>
                </div>
              </div>

              {/* Illnesses Tab Content */}
              <div
                class={`w-full max-w-md ${
                  this.activeTab === 1 ? 'block' : 'hidden'
                }`}
              >
                <div class="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                  {this.illnesses.map((illness: Illness, index: number) => {
                    const isSelected: boolean =
                      this.selectedIllness && illness.id === this.selectedIllness.id;
                    const isExpanded: boolean =
                      this.expandedIllnessId && illness.id === this.expandedIllnessId;

                    return (
                      <div key={illness.id}>
                        <div
                          class={`px-4 py-2 flex flex-col justify-center w-full border-2 border-transparent hover:border-[#9d83c6] cursor-pointer
                            ${index % 2 === 0 ? ' bg-gray-200 ' : ' bg-white '}
                            ${index === 0 && ' rounded-t-lg '}
                            ${isExpanded ? 'h-auto' : 'h-16'}
                          `}
                          onClick={() => this.handleSelectIllness(illness)}
                          style={isSelected ? { borderColor: '#7357be' } : {}}
                        >
                          <div class="flex flex-row justify-between items-center">
                            <div class="text-[#7357be] font-medium">
                              {illness.displayName}
                            </div>
                            <div class="flex items-center">
                              {illness.ended ? (
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
                                {formatDate(illness.startDate)}
                              </span>
                            </span>
                            {illness.endDate && (
                              <span class="text-sm text-gray-400">
                                To:
                                <span class="text-sm font-medium text-gray-600 ml-2">
                                  {formatDate(illness.endDate)}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div class="w-full flex flex-row justify-between items-center h-12">
                    <md-icon-button
                      title="View older illnesses"
                      class="m-1"
                      onClick={() => console.log('view older illnesses clicked')}
                    >
                      <span class="material-symbols-outlined text-gray-600">
                        arrow_back
                      </span>
                    </md-icon-button>
                    <md-icon-button
                      title="Register an illness"
                      class="m-1 w-20"
                      onClick={() => console.log('register an illness')}
                    >
                      <span class="material-symbols-outlined text-gray-600">
                        coronavirus
                      </span>
                      <span class="material-symbols-outlined text-gray-600">
                        add
                      </span>
                    </md-icon-button>
                    <md-icon-button
                      title="View newer illnesses"
                      class="m-1"
                      onClick={() => console.log('view newer illnesses clicked')}
                    >
                      <span class="material-symbols-outlined text-gray-600">
                        arrow_forward
                      </span>
                    </md-icon-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Details */}
          {showDetails && (
            <div
              class={`m-auto p-6 md:w-1/2 w-full flex flex-col items-center justify-center transform transition-all duration-500 ease-in-out opacity-100
                      animate-[slideInFromBottom_0.5s_ease-out]
                      md:animate-[slideInFromRight_0.5s_ease-out]`}
            >
              {/* Appointment details */}
              {this.selectedAppointment && (
                <div class="w-full max-w-md">
                  <div class="relative w-full max-w-md">
                    <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-0">
                      <md-icon-button onClick={this.resetSelection}>
                        <span class="material-symbols-outlined text-gray-600">
                          arrow_forward
                        </span>
                      </md-icon-button>
                    </div>

                    <h2 class="w-full text-center text-[#7357be] text-xl font-medium mb-6">
                      Appointment details
                    </h2>
                  </div>

                  <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
                    <div class="w-full flex flex-row justify-between items-center mb-1">
                      <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          calendar_month
                        </span>
                        Date
                      </div>
                      <span class="font-medium text-gray-600">
                        {formatDate(this.selectedAppointment.appointmentDate)}
                      </span>
                    </div>

                    <div class="w-full flex flex-row justify-between items-center mb-1">
                      <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          schedule
                        </span>
                        Time
                      </div>
                      <span class="font-medium text-gray-600">
                        {this.selectedAppointment.timeSlot.time}
                      </span>
                    </div>

                    <div class="w-full flex flex-row justify-between items-center mb-1">
                      <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          format_list_bulleted
                        </span>
                        Type
                      </div>
                      <span class="font-medium text-gray-600">
                        {this.selectedAppointment.type.displayName}
                      </span>
                    </div>

                    <div class="w-full flex flex-row justify-between items-center">
                      <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          person
                        </span>
                        Doctor
                      </div>
                      <span class="font-medium text-gray-600">
                        Dr. {this.selectedAppointment.doctor.firstName}{' '}
                        {this.selectedAppointment.doctor.lastName}
                      </span>
                    </div>
                  </div>

                  <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6 overflow-y-auto max-h-32">
                    <div class="text-gray-500 flex flex-row items-center gap-x-2 mb-1">
                      <span
                        class="material-symbols-outlined"
                        style={{ fontSize: '16px' }}
                      >
                        description
                      </span>
                      Reason
                    </div>
                    <p class="text-sm font-medium text-gray-600 text-wrap ml-1">
                      {this.selectedAppointment.reason}
                    </p>
                  </div>

                  <div class="w-full max-w-md flex flex-row justify-between items-center gap-x-3">
                    <md-filled-button
                      class="w-1/2 rounded-full bg-[#7357be]"
                      onClick={this.handleRescheduleAppointment}
                    >
                      Re-schedule
                    </md-filled-button>

                    <md-filled-button
                      class="w-1/2 rounded-full bg-[#7357be]"
                      onClick={this.handleCancelAppointment}
                    >
                      Cancel
                    </md-filled-button>
                  </div>
                </div>
              )}

              {/* Illness details */}
              {this.selectedIllness && (
                <div class="w-full max-w-md">
                  <div class="relative w-full max-w-md">
                    <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-0">
                      <md-icon-button onClick={this.resetSelection}>
                        <span class="material-symbols-outlined text-gray-600">
                          arrow_forward
                        </span>
                      </md-icon-button>
                    </div>

                    <h2 class="w-full text-center text-[#7357be] text-xl font-medium mb-6">
                      Illness details
                    </h2>
                  </div>

                  <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
                    <div class="w-full flex flex-row justify-between items-center mb-1">
                      <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          edit
                        </span>
                        Name
                      </div>
                      <span class="font-medium text-gray-600">
                        {this.selectedIllness.displayName}
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
                        {formatDate(this.selectedIllness.startDate)}
                      </span>
                    </div>

                    {this.selectedIllness.ended &&
                      this.selectedIllness.endDate && (
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
                              {formatDate(this.selectedIllness.endDate)}
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
                                this.selectedIllness.startDate,
                                this.selectedIllness.endDate,
                              )}
                            </span>
                          </div>
                        </>
                      )}

                    <div class="w-full flex flex-row justify-between items-center">
                      <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          {this.selectedIllness.ended
                            ? 'check_circle'
                            : 'pending'}
                        </span>
                        Status
                      </div>
                      <span class="font-medium text-gray-600">
                        {this.selectedIllness.ended ? 'Gone' : 'Ongoing'}
                      </span>
                    </div>
                  </div>

                  <div class="w-full max-w-md px-4 py-3 rounded-md bg-gray-200 mb-6">
                    <div class="flex flex-row justify-between items-center mb-2">
                      <div class="text-gray-500 flex flex-row items-center gap-x-2">
                        <span
                          class="material-symbols-outlined"
                          style={{ fontSize: '16px' }}
                        >
                          calendar_month
                        </span>
                        Appointments
                      </div>
                      {this.selectedIllness.appointments.length > 0 && (
                        <md-icon-button
                          onClick={() =>
                            this.toggleIllnessAppointments(this.selectedIllness.id)
                          }
                          style={{ width: '24px', height: '24px' }}
                        >
                        <span class="material-symbols-outlined">
                          {this.expandedIllnessId === this.selectedIllness.id
                            ? 'expand_less'
                            : 'expand_more'}
                        </span>
                        </md-icon-button>
                      )}
                    </div>

                    {this.selectedIllness.appointments.length <= 0 ? (
                      <div class="text-sm font-medium text-gray-600">
                        No appointments for this illness yet.
                      </div>
                    ) : this.expandedIllnessId === this.selectedIllness.id ? (
                      <div class="w-full rounded-md bg-gray-200 overflow-y-auto max-h-28">
                        {this.selectedIllness.appointments.map(
                          (appointment: Appointment) => (
                            <div
                              key={appointment.id}
                              class="flex justify-between items-center py-1 px-2 hover:bg-gray-300 rounded cursor-pointer mb-1"
                              onClick={() =>
                                this.handleSelectAppointment(appointment)
                              }
                            >
                              <div class="flex items-center">
                                <span
                                  class="material-symbols-outlined text-gray-500 mr-2"
                                  style={{ fontSize: '14px' }}
                                >
                                  calendar_month
                                </span>
                                {getDateAndTimeTitle(appointment.appointmentDate, appointment.timeSlot.time, "medium", "text-sm")}
                              </div>
                              <div class="text-xs text-gray-600 font-medium">
                                {appointment.type.displayName}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div class="text-sm font-medium text-gray-600 ml-2">
                        {this.selectedIllness.appointments.length} appointment
                        {this.selectedIllness.appointments.length !== 1 &&
                          's'}
                      </div>
                    )}
                  </div>

                  <div class="w-full max-w-md flex flex-row justify-between items-center gap-x-3">
                    <md-filled-button
                      class="w-1/2 rounded-full bg-[#7357be]"
                      onClick={this.handleScheduleAppointmentFromIllness}
                    >
                      Schedule
                    </md-filled-button>

                    <md-filled-button
                      class="w-1/2 rounded-full bg-[#7357be]"
                      onClick={this.handleToggleIllnessStatus}
                    >
                      {this.selectedIllness.ended ? 'Reset as ongoing' : 'Set as gone'}
                    </md-filled-button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
}

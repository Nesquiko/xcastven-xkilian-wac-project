import { formatDate } from '../../utils/utils';
import { Component, h, Prop, State } from '@stencil/core';
import {
  AppointmentDisplay,
  Condition,
  ConditionDisplay,
  DoctorAppointment,
  PatientAppointment,
  PrescriptionDisplay,
} from '../../api/generated';

@Component({
  tag: 'xcastven-xkilian-project-drawer',
  shadow: false,
})
export class Drawer {
  @Prop() isDrawerOpen: boolean;
  @Prop() selectedDate: Date;
  @Prop() selectedAppointment: AppointmentDisplay;
  @Prop() selectedCondition: ConditionDisplay;
  @Prop() selectedPrescription: PrescriptionDisplay;
  @Prop() showLegend: boolean;

  @Prop() handleResetSelection: () => void;
  @Prop() getAppointmentsForDate: (date: Date) => Array<AppointmentDisplay>;
  @Prop() getConditionsForDate: (date: Date) => Array<ConditionDisplay>;
  @Prop() getPrescriptionsForDate: (date: Date) => Array<PrescriptionDisplay>;
  @Prop() handleSelectAppointment: (appointment: AppointmentDisplay) => void;
  @Prop() handleSelectCondition: (condition: ConditionDisplay) => void;
  @Prop() handleSelectPrescription: (prescription: PrescriptionDisplay) => void;

  @Prop() handleRescheduleAppointment: (appointment: PatientAppointment | DoctorAppointment) => void;
  @Prop() handleCancelAppointment: (appointment: PatientAppointment | DoctorAppointment) => void;
  @Prop() handleScheduleAppointmentFromCondition: (condition: Condition) => void;
  @Prop() handleToggleConditionStatus: () => void;

  @State() activeTab: number = 0;

  private handleTabChange = (event) => {
    const tabBar = event.target;
    this.activeTab = tabBar.activeTabIndex;
  };

  render() {
    return (
      <div
        class={`fixed top-0 right-0 h-full min-w-md max-w-md bg-white shadow-lg transform transition-transform duration-300 z-100 ${
          this.isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div class="p-4 flex flex-col h-full">

          {/* Selected date */}
          {this.selectedDate ? (
            <div class="w-full">
              <h2 class="w-full mb-6 text-center text-[#7357be] font-medium text-lg">
                {formatDate(this.selectedDate)}
              </h2>

              <div class="flex flex-col gap-y-2 w-full justify-center items-center">
                {/* Tabs */}
                <div class="w-full max-w-md bg-gray-100 rounded-lg overflow-hidden">
                  <md-tabs
                    class="w-full"
                    onchange={(e) => this.handleTabChange(e)}
                  >
                    <md-primary-tab class="w-1/3 px-4">
                      <span class="w-full">My appointments</span>
                    </md-primary-tab>
                    <md-primary-tab class="w-1/3 px-4">
                      <span class="w-full">My conditions</span>
                    </md-primary-tab>
                    <md-primary-tab class="w-1/3 px-4">
                      <span class="w-full">My prescriptions</span>
                    </md-primary-tab>
                  </md-tabs>
                </div>

                {/* Appointments Tab Content */}
                <div class={`w-full max-w-md ${this.activeTab === 0 ? 'block' : 'hidden'}`}>
                  <xcastven-xkilian-project-appointments-list
                    appointments={this.getAppointmentsForDate(this.selectedDate)}
                    handleSelectAppointment={this.handleSelectAppointment}
                  />
                </div>

                {/* Conditions Tab Content */}
                <div class={`w-full max-w-md ${this.activeTab === 1 ? 'block' : 'hidden'}`}>
                  <xcastven-xkilian-project-conditions-list
                    conditions={this.getConditionsForDate(this.selectedDate)}
                    handleSelectCondition={this.handleSelectCondition}
                  />
                </div>

                {/* Prescriptions Tab Content */}
                <div class={`w-full max-w-md ${this.activeTab === 2 ? 'block' : 'hidden'}`}>
                  <xcastven-xkilian-project-prescriptions-list
                    prescriptions={this.getPrescriptionsForDate(this.selectedDate)}
                    handleSelectPrescription={this.handleSelectPrescription}
                  />
                </div>
              </div>
            </div>
          ) : this.selectedAppointment ? (
            <xcastven-xkilian-project-appointment-detail
              appointmentId={this.selectedAppointment.id}
              handleResetSelection={this.handleResetSelection}
              handleRescheduleAppointment={this.handleRescheduleAppointment}
              handleCancelAppointment={this.handleCancelAppointment}
            />
          ) : this.selectedCondition ? (
            <xcastven-xkilian-project-condition-detail
              conditionId={this.selectedCondition.id}
              handleResetSelection={this.handleResetSelection}
              handleSelectAppointment={this.handleSelectAppointment}
              handleScheduleAppointmentFromCondition={this.handleScheduleAppointmentFromCondition}
              handleToggleConditionStatus={this.handleToggleConditionStatus}
            />
          ) : this.selectedPrescription ? (
            <xcastven-xkilian-project-prescription-detail
              prescriptionId={this.selectedPrescription.id}
              handleResetSelection={this.handleResetSelection}
            />
          ) : this.showLegend && (
            <xcastven-xkilian-project-legend
              handleResetSelection={this.handleResetSelection}
            />
          )}
        </div>
      </div>
    );
  };
}

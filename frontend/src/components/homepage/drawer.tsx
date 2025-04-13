import { Api } from '../../api/api';
import {
  AppointmentDisplay,
  AppointmentStatus,
  Condition,
  ConditionDisplay, Doctor,
  DoctorAppointment,
  Equipment,
  Facility,
  Medicine,
  PatientAppointment, Prescription,
  PrescriptionDisplay,
  User,
} from '../../api/generated';
import { formatDate } from '../../utils/utils';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-drawer',
  shadow: false,
})
export class Drawer {
  @Prop() api: Api;
  @Prop() user: User;
  @Prop() isDoctor: boolean;

  @Prop() isDrawerOpen: boolean;
  @Prop() selectedDate: Date;
  @Prop() selectedAppointment: AppointmentDisplay;
  @Prop() selectedCondition: ConditionDisplay;
  @Prop() selectedPrescription: PrescriptionDisplay;
  @Prop() selectedAppointmentStatusGroup: AppointmentStatus;
  @Prop() showLegend: boolean;

  @Prop() activeTab: number;
  @Prop() handleTabChange: (event: Event) => void;

  @Prop() handleResetSelection: () => void;
  @Prop() getAppointmentsForDate: (date: Date) => Array<AppointmentDisplay>;
  @Prop() getConditionsForDate: (date: Date) => Array<ConditionDisplay>;
  @Prop() getPrescriptionsForDate: (date: Date) => Array<PrescriptionDisplay>;
  @Prop() getAppointmentsForDateByStatus: (
    date: Date,
    appointmentStatus: AppointmentStatus,
  ) => Array<AppointmentDisplay>;
  @Prop() handleSelectAppointment: (appointment: AppointmentDisplay) => void;
  @Prop() handleSelectCondition: (condition: ConditionDisplay) => void;
  @Prop() handleSelectPrescription: (prescription: PrescriptionDisplay) => void;

  @Prop() handleRescheduleAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
    newAppointmentDateTime: Date,
    newAppointmentDoctor: Doctor,
    reason: string,
  ) => void;
  @Prop() handleCancelAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
    cancellationReason: string,
  ) => void;

  @Prop() handleAcceptAppointment: (appointment: PatientAppointment | DoctorAppointment) => void;
  @Prop() handleDenyAppointment: (appointment: PatientAppointment | DoctorAppointment) => void;
  @Prop() handleSaveResourcesOnAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
    resources: {
      facility: Facility;
      equipment: Equipment;
      medicine: Medicine;
    },
  ) => void;
  @Prop() handleUpdatePrescriptionForAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
    prescriptionId: string,
    updatedPrescription: PrescriptionDisplay,
  ) => void;
  @Prop() handleAddPrescriptionForAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
    newPrescription: Prescription,
  ) => void;

  @Prop() handleScheduleAppointmentFromCondition: (condition: Condition) => void;
  @Prop() handleToggleConditionStatus: (condition: Condition) => void;

  render() {
    const displayStatus: AppointmentStatus = (
      this.activeTab === 0
        ? 'scheduled'
        : this.activeTab === 1
          ? 'requested'
          : this.activeTab === 2
            ? 'denied'
            : this.activeTab === 3
              ? 'completed'
              : this.activeTab === 4
                ? 'cancelled'
                : 'scheduled'
    ) as AppointmentStatus;

    return (
      <div
        class={`fixed top-0 right-0 z-100 h-full max-w-md min-w-md transform bg-white shadow-lg transition-transform duration-300 ${
          this.isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div class="flex h-full flex-col overflow-y-auto p-4">
          {/* Selected date */}
          {this.selectedDate && !this.isDoctor ? (
            <div class="w-full">
              <h2 class="mb-6 w-full text-center text-lg font-medium text-[#7357be]">
                {formatDate(this.selectedDate)}
              </h2>

              <div class="flex w-full flex-col items-center justify-center gap-y-2">
                {/* Tabs */}
                <div class="w-full max-w-md overflow-hidden rounded-lg bg-gray-100">
                  <md-tabs class="w-full" onchange={e => this.handleTabChange(e)}>
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
                    noDataMessage="No appointments for this date"
                    currentDate={this.selectedDate}
                  />
                </div>

                {/* Conditions Tab Content */}
                <div class={`w-full max-w-md ${this.activeTab === 1 ? 'block' : 'hidden'}`}>
                  <xcastven-xkilian-project-conditions-list
                    conditions={this.getConditionsForDate(this.selectedDate)}
                    handleSelectCondition={this.handleSelectCondition}
                    currentDate={this.selectedDate}
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
          ) : this.selectedDate && this.isDoctor ? (
            <div class="w-full">
              <h2 class="mb-6 w-full text-center text-lg font-medium text-[#7357be]">
                {formatDate(this.selectedDate)}
              </h2>

              <div class="flex w-full flex-col items-center justify-center gap-y-2">
                {/* Tabs */}
                <div class="w-full max-w-md overflow-hidden rounded-lg bg-gray-100">
                  <md-tabs
                    class="w-full"
                    activeTabIndex={this.activeTab}
                    onchange={this.handleTabChange}
                  >
                    <md-primary-tab class="w-1/5 px-4">
                      <span class="w-full">Scheduled</span>
                    </md-primary-tab>
                    <md-primary-tab class="w-1/5 px-4">
                      <span class="w-full">Requested</span>
                    </md-primary-tab>
                    <md-primary-tab class="w-1/5 px-4">
                      <span class="w-full">Denied</span>
                    </md-primary-tab>
                    <md-primary-tab class="w-1/5 px-4">
                      <span class="w-full">Completed</span>
                    </md-primary-tab>
                    <md-primary-tab class="w-1/5 px-4">
                      <span class="w-full">Cancelled</span>
                    </md-primary-tab>
                  </md-tabs>
                </div>

                {/* Appointments Tab Content */}
                <div class={`w-full max-w-md`}>
                  <xcastven-xkilian-project-appointments-list
                    user={this.user}
                    isDoctor={this.isDoctor}
                    appointments={this.getAppointmentsForDateByStatus(
                      this.selectedDate,
                      displayStatus,
                    )}
                    handleSelectAppointment={this.handleSelectAppointment}
                    noDataMessage={'No ' + displayStatus + ' appointments for this date'}
                    currentDate={this.selectedDate}
                  />
                </div>
              </div>
            </div>
          ) : this.selectedAppointment ? (
            <xcastven-xkilian-project-appointment-detail
              api={this.api}
              user={this.user}
              isDoctor={this.isDoctor}
              appointmentId={this.selectedAppointment.id}
              handleResetSelection={this.handleResetSelection}
              handleRescheduleAppointment={this.handleRescheduleAppointment}
              handleCancelAppointment={this.handleCancelAppointment}
              handleAcceptAppointment={this.handleAcceptAppointment}
              handleDenyAppointment={this.handleDenyAppointment}
              handleSaveResourcesOnAppointment={this.handleSaveResourcesOnAppointment}
              handleSelectPrescription={this.handleSelectPrescription}
              handleUpdatePrescriptionForAppointment={this.handleUpdatePrescriptionForAppointment}
              handleAddPrescriptionForAppointment={this.handleAddPrescriptionForAppointment}
            />
          ) : this.selectedCondition ? (
            <xcastven-xkilian-project-condition-detail
              api={this.api}
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
          ) : (
            this.showLegend && (
              <xcastven-xkilian-project-legend handleResetSelection={this.handleResetSelection} />
            )
          )}
        </div>
      </div>
    );
  }
}

import {
  AppointmentStatus,
  DoctorAppointment,
  Equipment,
  Facility,
  instanceOfDoctorAppointment,
  instanceOfPatientAppointment,
  Medicine,
  PatientAppointment,
  User,
} from '../../api/generated';
import { AvailableResourcesExample } from '../../data-examples/available-resources';
import { DoctorAppointmentDetailExample } from '../../data-examples/doctor-appointment-detail';
import {
  formatDate,
  formatTime,
  getDoctorAppointmentActions,
  getPatientAppointmentActions,
} from '../../utils/utils';
import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-appointment-detail',
  shadow: false,
})
export class AppointmentDetail {
  @Prop() user: User;
  @Prop() isDoctor: boolean;
  @Prop() appointmentId: string;
  @Prop() handleResetSelection: () => void;

  @Prop() handleRescheduleAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
  ) => void;
  @Prop() handleCancelAppointment: (appointment: PatientAppointment | DoctorAppointment) => void;

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

  @State() appointment: PatientAppointment | DoctorAppointment = DoctorAppointmentDetailExample;

  @State() availableEquipment: Array<Equipment> = AvailableResourcesExample.equipment;
  @State() availableFacilities: Array<Facility> = AvailableResourcesExample.facilities;
  @State() availableMedicine: Array<Medicine> = AvailableResourcesExample.medicine;
  @State() selectedEquipment: Equipment = instanceOfDoctorAppointment(this.appointment) ? this.appointment.equipment[0] : null;
  @State() selectedFacility: Facility = instanceOfDoctorAppointment(this.appointment) ? this.appointment.facilities[0] : null;
  @State() selectedMedicine: Medicine = instanceOfDoctorAppointment(this.appointment) ? this.appointment.medicine[0] : null;

  private getPatientAppointmentStatusMessage = (appointmentStatus: AppointmentStatus) => {
    switch (appointmentStatus) {
      case 'requested':
        return "This appointment is waiting for a reaction from the Doctor's office.";
      case 'scheduled':
        return '';
      case 'completed':
        return 'This appointment has already been completed.';
      case 'denied':
        return "This appointment has already been denied by the Doctor's office.";
      case 'cancelled':
        return 'This appointment has already been cancelled.';
      default:
        return '';
    }
  };

  private getDoctorAppointmentStatusMessage = (appointmentStatus: AppointmentStatus) => {
    switch (appointmentStatus) {
      case 'requested':
        return '';
      case 'scheduled':
        return '';
      case 'completed':
        return 'This appointment has already been completed.';
      case 'denied':
        return 'This appointment has already been denied.';
      case 'cancelled':
        return 'This appointment has already been cancelled.';
      default:
        return '';
    }
  };

  private handleSelectFacility = (event: Event) => {
    const newFacilityId: string = (event.target as HTMLSelectElement).value;
    this.selectedFacility = this.availableFacilities.find(
      (facility: Facility): boolean => facility.id === newFacilityId,
    );
  };

  private handleSelectEquipment = (event: Event) => {
    const newEquipmentId: string = (event.target as HTMLSelectElement).value;
    this.selectedEquipment = this.availableEquipment.find(
      (equipment: Equipment): boolean => equipment.id === newEquipmentId,
    );
  };

  private handleSelectMedicine = (event: Event) => {
    const newMedicineId: string = (event.target as HTMLSelectElement).value;
    this.selectedMedicine = this.availableMedicine.find(
      (medicine: Medicine): boolean => medicine.id === newMedicineId,
    );
  };

  render() {
    if (!this.appointment) return null;

    console.log(this.isDoctor, instanceOfDoctorAppointment(this.appointment));

    return (
      <div class="w-full max-w-md">
        <div class="relative w-full max-w-md">
          <div class="absolute top-1/2 left-0 -translate-x-0 -translate-y-1/2 transform">
            <md-icon-button onClick={this.handleResetSelection}>
              <md-icon class="text-gray-600">arrow_forward</md-icon>
            </md-icon-button>
          </div>

          <h2 class="mb-6 w-full text-center text-xl font-medium text-[#7357be]">
            Appointment details
          </h2>
        </div>

        <div class="mb-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
          <div class="mb-1 flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>calendar_month</md-icon>
              Date
            </div>
            <span class="font-medium text-gray-600">
              {formatDate(this.appointment.appointmentDateTime)}
            </span>
          </div>

          <div class="mb-1 flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>schedule</md-icon>
              Time
            </div>
            <span class="font-medium text-gray-600">
              {formatTime(this.appointment.appointmentDateTime)}
            </span>
          </div>

          <div class="mb-1 flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>format_list_bulleted</md-icon>
              Type
            </div>
            <span class="font-medium text-gray-600">{this.appointment.type}</span>
          </div>

          {this.isDoctor && instanceOfDoctorAppointment(this.appointment) && (
            <div class="mb-1 flex w-full flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-x-2 text-gray-500">
                <md-icon style={{ fontSize: '16px' }}>person</md-icon>
                Patient
              </div>
              <span class="font-medium text-gray-600">
                {this.appointment.patient.firstName} {this.appointment.patient.lastName}
              </span>
            </div>
          )}
          {!this.isDoctor && instanceOfPatientAppointment(this.appointment) && (
            <div class="mb-1 flex w-full flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-x-2 text-gray-500">
                <md-icon style={{ fontSize: '16px' }}>person</md-icon>
                Doctor
              </div>
              <span class="font-medium text-gray-600">
                Dr. {this.appointment.doctor.firstName} {this.appointment.doctor.lastName}
              </span>
            </div>
          )}

          <div class="flex w-full flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>info</md-icon>
              Status
            </div>
            <span class="font-medium text-gray-600">
              {this.appointment.status[0].toUpperCase() + this.appointment.status.slice(1)}
            </span>
          </div>
        </div>

        <div class="mb-6 max-h-32 w-full max-w-md overflow-y-auto rounded-md bg-gray-200 px-4 py-3">
          <div class="mb-1 flex flex-row items-center gap-x-2 text-gray-500">
            <md-icon style={{ fontSize: '16px' }}>description</md-icon>
            Reason
          </div>
          <p class="ml-1 text-sm font-medium text-wrap text-gray-600">{this.appointment.reason}</p>
        </div>

        {this.isDoctor &&
          instanceOfDoctorAppointment(this.appointment) &&
          this.appointment.status === 'scheduled' && (
            <div class="mb-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
              <div class="mb-3 w-full text-center text-gray-500">Resources</div>
              <div class="mb-1 flex w-full flex-col gap-y-3">
                <md-outlined-select
                  label="Facility"
                  class="w-full"
                  value={this.selectedFacility}
                  onInput={(e: Event) => this.handleSelectFacility(e)}
                >
                  {this.availableFacilities.map((facility: Facility) => (
                    <md-select-option value={facility.id}>
                      <div slot="headline">{facility.name}</div>
                    </md-select-option>
                  ))}
                </md-outlined-select>

                <md-outlined-select
                  label="Equipment"
                  class="w-full"
                  value={this.selectedEquipment}
                  onInput={(e: Event) => this.handleSelectEquipment(e)}
                >
                  {this.availableEquipment.map((equipment: Equipment) => (
                    <md-select-option value={equipment.id}>
                      <div slot="headline">{equipment.name}</div>
                    </md-select-option>
                  ))}
                </md-outlined-select>

                <md-outlined-select
                  label="Medicine"
                  class="w-full"
                  value={this.selectedMedicine}
                  onInput={(e: Event) => this.handleSelectMedicine(e)}
                >
                  {this.availableMedicine.map((medicine: Medicine) => (
                    <md-select-option value={medicine.id}>
                      <div slot="headline">{medicine.name}</div>
                    </md-select-option>
                  ))}
                </md-outlined-select>
              </div>
            </div>
          )}

        {this.isDoctor && !(this.appointment.status in ['scheduled', 'requested']) && (
          <p class="mb-6 text-center text-sm text-wrap text-gray-600">
            {this.getDoctorAppointmentStatusMessage(this.appointment.status)}
          </p>
        )}
        {!this.isDoctor && !(this.appointment.status in ['scheduled']) && (
          <p class="mb-6 text-center text-sm text-wrap text-gray-600">
            {this.getPatientAppointmentStatusMessage(this.appointment.status)}
          </p>
        )}

        {this.isDoctor
          ? getDoctorAppointmentActions(
              this.appointment.status,
              () => this.handleCancelAppointment(this.appointment),
              () => this.handleAcceptAppointment(this.appointment),
              () => this.handleDenyAppointment(this.appointment),
              () =>
                this.handleSaveResourcesOnAppointment(this.appointment, {
                  facility: this.selectedFacility,
                  equipment: this.selectedEquipment,
                  medicine: this.selectedMedicine,
                }),
            )
          : getPatientAppointmentActions(
              this.appointment.status,
              () => this.handleRescheduleAppointment(this.appointment),
              () => this.handleCancelAppointment(this.appointment),
            )}
      </div>
    );
  }
}

import { Api, ApiError } from '../../api/api';
import {
  AppointmentStatus,
  DoctorAppointment,
  Equipment,
  Facility,
  instanceOfDoctorAppointment,
  instanceOfPatientAppointment,
  Medicine,
  PatientAppointment,
  Prescription,
  PrescriptionDisplay,
  User,
} from '../../api/generated';
import {
  formatAppointmentType,
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
  @Prop() api: Api;
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
  @Prop() handleSelectPrescription: (prescription: PrescriptionDisplay) => void;
  @Prop() handleUpdatePrescriptionForAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
    prescriptionId: string,
    updatedPrescription: PrescriptionDisplay,
  ) => void;

  @State() appointment: PatientAppointment | DoctorAppointment = undefined;
  @State() availableEquipment: Array<Equipment> = [];
  @State() availableFacilities: Array<Facility> = [];
  @State() availableMedicine: Array<Medicine> = [];

  @State() selectedEquipment: Equipment =
    this.appointment && instanceOfDoctorAppointment(this.appointment)
      ? this.appointment.equipment[0]
      : null;
  @State() selectedFacility: Facility =
    this.appointment && instanceOfDoctorAppointment(this.appointment)
      ? this.appointment.facilities[0]
      : null;
  @State() selectedMedicine: Medicine =
    this.appointment && instanceOfDoctorAppointment(this.appointment)
      ? this.appointment.medicine[0]
      : null;

  async componentWillLoad() {
    try {
      if (this.isDoctor) {
        const appt = await this.api.appointments.doctorsAppointment({
          doctorId: this.user.id,
          appointmentId: this.appointmentId,
        });
        this.appointment = appt;
        this.selectedEquipment = appt.equipment?.[0] ?? null;
        this.selectedFacility = appt.facilities?.[0] ?? null;
        this.selectedMedicine = appt.medicine?.[0] ?? null;
      } else {
        this.appointment = await this.api.appointments.patientsAppointment({
          patientId: this.user.id,
          appointmentId: this.appointmentId,
        });
      }
    } catch (err) {
      if (!(err instanceof ApiError)) {
        // TODO kili some generic error
        return;
      }

      // TODO kili some internal server error, i think there is no other error I'm returing
    }
  }

  @State() prescriptionsExpanded: boolean = false;
  @State() showEditResources: boolean = false;

  @State() addingPrescription: boolean = false;
  @State() addingPrescriptionName: string = '';
  @State() addingPrescriptionStart: Date = null;
  @State() addingPrescriptionEnd: Date = null;
  @State() addingPrescriptionDoctorsNote: string = '';

  @State() editingPrescription: PrescriptionDisplay = null;
  @State() editingPrescriptionNewName: string = '';
  @State() editingPrescriptionNewStart: Date = null;
  @State() editingPrescriptionNewEnd: Date = null;
  @State() editingPrescriptionNewDoctorsNote: string = '';

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

  private handleUpdatePrescriptionNameChange = (event: Event) => {
    this.editingPrescriptionNewName = (event.target as HTMLSelectElement).value;
  };

  private handleUpdatePrescriptionStartChange = (event: Event) => {
    this.editingPrescriptionNewStart = new Date((event.target as HTMLSelectElement).value);
  };

  private handleUpdatePrescriptionEndChange = (event: Event) => {
    this.editingPrescriptionNewEnd = new Date((event.target as HTMLSelectElement).value);
  };

  private handleUpdatePrescriptionDoctorsNoteChange = (event: Event) => {
    this.editingPrescriptionNewDoctorsNote = (event.target as HTMLSelectElement).value;
  };

  private handleAddPrescriptionNameChange = (event: Event) => {
    this.addingPrescriptionName = (event.target as HTMLSelectElement).value;
  };

  private handleAddPrescriptionStartChange = (event: Event) => {
    this.addingPrescriptionStart = new Date((event.target as HTMLSelectElement).value);
  };

  private handleAddPrescriptionEndChange = (event: Event) => {
    this.addingPrescriptionEnd = new Date((event.target as HTMLSelectElement).value);
  };

  private handleAddPrescriptionDoctorsNoteChange = (event: Event) => {
    this.addingPrescriptionDoctorsNote = (event.target as HTMLSelectElement).value;
  };

  render() {
    if (!this.appointment) return null;

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
            <span class="font-medium text-gray-600">
              {formatAppointmentType(this.appointment.type)}
            </span>
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

        {this.isDoctor && instanceOfDoctorAppointment(this.appointment) && (
          <div class="relative mb-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
            <div class="mb-1 flex flex-row items-center justify-start gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>library_add</md-icon>
              Resources
            </div>

            {instanceOfDoctorAppointment(this.appointment) && (
              <md-icon-button
                title="Edit resources"
                class="absolute top-1 left-32"
                onClick={() => (this.showEditResources = !this.showEditResources)}
              >
                <md-icon style={{ fontSize: '16px' }}>edit</md-icon>
              </md-icon-button>
            )}

            <div class="flex w-full flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-x-2 text-gray-500">
                <md-icon style={{ fontSize: '16px' }}>meeting_room</md-icon>
                Facility
              </div>
              <span class="font-medium text-gray-600">{this.appointment.facilities[0].name}</span>
            </div>
            <div class="flex w-full flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-x-2 text-gray-500">
                <md-icon style={{ fontSize: '16px' }}>service_toolbox</md-icon>
                Equipment
              </div>
              <span class="font-medium text-gray-600">{this.appointment.equipment[0].name}</span>
            </div>
            <div class="flex w-full flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-x-2 text-gray-500">
                <md-icon style={{ fontSize: '16px' }}>vaccines</md-icon>
                Medicine
              </div>
              <span class="font-medium text-gray-600">{this.appointment.medicine[0].name}</span>
            </div>

            {this.isDoctor &&
              instanceOfDoctorAppointment(this.appointment) &&
              this.appointment.status === 'scheduled' &&
              this.showEditResources && (
                <div class="mt-3 w-full">
                  <div class="mb-3 flex w-full flex-col gap-y-3">
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

                  <md-filled-button
                    class={`w-full rounded-full bg-[#7357be]`}
                    onClick={() => {
                      this.showEditResources = false;
                      const newResources: {
                        facility: Facility;
                        equipment: Equipment;
                        medicine: Medicine;
                      } = {
                        facility: this.selectedFacility,
                        equipment: this.selectedEquipment,
                        medicine: this.selectedMedicine,
                      };

                      this.handleSaveResourcesOnAppointment(this.appointment, newResources);
                    }}
                  >
                    Save resources
                  </md-filled-button>
                </div>
              )}
          </div>
        )}

        <div class="relative mb-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
          <div class="mb-2 flex flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>medication</md-icon>
              Prescriptions
            </div>
            {this.appointment.prescriptions && this.appointment.prescriptions.length > 0 && (
              <md-icon-button
                title={this.prescriptionsExpanded ? 'Expand' : 'Close'}
                onClick={() => (this.prescriptionsExpanded = !this.prescriptionsExpanded)}
                style={{ width: '24px', height: '24px' }}
              >
                <md-icon style={{ fontSize: '16px' }}>
                  {this.prescriptionsExpanded ? 'expand_less' : 'expand_more'}
                </md-icon>
              </md-icon-button>
            )}
            {instanceOfDoctorAppointment(this.appointment) && (
              <md-icon-button
                title="Add a prescription"
                class="absolute top-1 left-36"
                onClick={() => (this.addingPrescription = !this.addingPrescription)}
              >
                <md-icon style={{ fontSize: '16px' }}>add</md-icon>
              </md-icon-button>
            )}
          </div>

          {this.appointment.prescriptions && this.appointment.prescriptions.length <= 0 ? (
            <div class="text-sm font-medium text-gray-600">
              No prescriptions for this appointments
            </div>
          ) : this.prescriptionsExpanded ? (
            <div class="max-h-28 w-full overflow-y-auto rounded-md bg-gray-200">
              {this.appointment.prescriptions.map((prescription: PrescriptionDisplay) => (
                <div
                  key={prescription.id}
                  class="mr-2 flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-gray-300"
                  onClick={() => this.handleSelectPrescription(prescription)}
                >
                  <div class="flex items-center font-medium text-gray-600">
                    <md-icon class="mr-2" style={{ fontSize: '14px' }}>
                      medication
                    </md-icon>
                    {prescription.name}
                  </div>
                  {instanceOfDoctorAppointment(this.appointment) && (
                    <md-icon-button
                      title="Edit prescription"
                      onClick={(event: Event) => {
                        event.stopPropagation();

                        this.editingPrescriptionNewName = prescription.name;
                        this.editingPrescriptionNewStart = prescription.start;
                        this.editingPrescriptionNewEnd = prescription.end;
                        this.editingPrescription = prescription;
                      }}
                      style={{ width: '24px', height: '24px' }}
                    >
                      <md-icon style={{ fontSize: '16px' }}>edit</md-icon>
                    </md-icon-button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div class="ml-2 text-sm font-medium text-gray-600">
              {this.appointment.prescriptions ? this.appointment.prescriptions.length : 0}{' '}
              prescription
              {this.appointment.prescriptions
                ? this.appointment.prescriptions.length !== 1 && 's'
                : 's'}
            </div>
          )}

          {this.isDoctor &&
            instanceOfDoctorAppointment(this.appointment) &&
            this.editingPrescription && (
              <div class="mt-3 w-full">
                <div class="mb-3 flex w-full flex-col gap-y-3">
                  <md-filled-text-field
                    label="Prescription name"
                    class="w-full"
                    value={this.editingPrescriptionNewName}
                    onInput={(e: Event) => this.handleUpdatePrescriptionNameChange(e)}
                  />

                  <md-filled-text-field
                    label="Prescription start date"
                    class="w-full"
                    value={this.editingPrescriptionNewStart}
                    onInput={(e: Event) => this.handleUpdatePrescriptionStartChange(e)}
                  />

                  <md-filled-text-field
                    label="Prescription end date"
                    class="w-full"
                    value={this.editingPrescriptionNewEnd}
                    onInput={(e: Event) => this.handleUpdatePrescriptionEndChange(e)}
                  />

                  <md-filled-text-field
                    label="Prescription doctor's note"
                    class="w-full"
                    value={this.editingPrescriptionNewDoctorsNote}
                    onInput={(e: Event) => this.handleUpdatePrescriptionDoctorsNoteChange(e)}
                  />
                </div>

                <md-filled-button
                  class={`w-full rounded-full bg-[#7357be]`}
                  onClick={() => {
                    const updatedPrescription: Prescription = {
                      ...this.editingPrescription,
                      name: this.editingPrescriptionNewName,
                      start: this.editingPrescriptionNewStart,
                      end: this.editingPrescriptionNewEnd,
                      doctorsNote: this.editingPrescriptionNewDoctorsNote,
                    };

                    this.handleUpdatePrescriptionForAppointment(
                      this.appointment,
                      this.editingPrescription.id,
                      updatedPrescription,
                    );

                    this.editingPrescription = null;
                    this.editingPrescriptionNewName = '';
                    this.editingPrescriptionNewStart = null;
                    this.editingPrescriptionNewEnd = null;
                  }}
                >
                  Save prescription
                </md-filled-button>
              </div>
            )}

          {this.isDoctor &&
            instanceOfDoctorAppointment(this.appointment) &&
            this.addingPrescription && (
              <div class="mt-3 w-full">
                <div class="mb-3 flex w-full flex-col gap-y-3">
                  <md-filled-text-field
                    label="Prescription name"
                    class="w-full"
                    value={this.addingPrescriptionName}
                    onInput={(e: Event) => this.handleAddPrescriptionNameChange(e)}
                  />

                  <md-filled-text-field
                    label="Prescription start date"
                    class="w-full"
                    value={this.addingPrescriptionStart}
                    onInput={(e: Event) => this.handleAddPrescriptionStartChange(e)}
                  />

                  <md-filled-text-field
                    label="Prescription end date"
                    class="w-full"
                    value={this.addingPrescriptionEnd}
                    onInput={(e: Event) => this.handleAddPrescriptionEndChange(e)}
                  />

                  <md-filled-text-field
                    label="Prescription doctor's note"
                    class="w-full"
                    value={this.addingPrescriptionDoctorsNote}
                    onInput={(e: Event) => this.handleAddPrescriptionDoctorsNoteChange(e)}
                  />
                </div>

                <md-filled-button
                  class={`w-full rounded-full bg-[#7357be]`}
                  onClick={() => {
                    const newPrescription: Prescription = {
                      id: 'new-prescription',
                      name: this.addingPrescriptionName,
                      start: this.addingPrescriptionStart,
                      end: this.addingPrescriptionEnd,
                      doctorsNote: this.addingPrescriptionDoctorsNote,
                    };

                    /*this.handleAddPrescriptionForAppointment(
                      this.appointment,
                      newPrescription,
                    );*/

                    this.addingPrescriptionDoctorsNote = null;
                    this.addingPrescriptionName = '';
                    this.addingPrescriptionStart = null;
                    this.addingPrescriptionEnd = null;
                  }}
                >
                  Add prescription
                </md-filled-button>
              </div>
            )}
        </div>

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

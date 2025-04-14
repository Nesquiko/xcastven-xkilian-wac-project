import { Api, ApiError } from '../../api/api';
import {
  AppointmentStatus,
  Doctor,
  DoctorAppointment,
  Equipment,
  Facility,
  instanceOfDoctorAppointment,
  instanceOfPatientAppointment,
  Medicine,
  NewPrescription,
  PatientAppointment,
  Prescription,
  PrescriptionDisplay,
  TimeSlot,
  User,
} from '../../api/generated';
import {
  days,
  formatAppointmentType,
  formatDate,
  formatTime,
  getDatePart,
  getDoctorAppointmentActions,
  getPatientAppointmentActions,
  months,
  updateDatePart,
  years,
} from '../../utils/utils';
import { toastService } from '../services/toast-service';
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
    newAppointmentDateTime: Date,
    newAppointmentDoctor: Doctor,
    reason: string,
  ) => Promise<void>;
  @Prop() handleCancelAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
    cancellationReason: string,
  ) => Promise<void>;

  @Prop() handleAcceptAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
  ) => Promise<void>;
  @Prop() handleDenyAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
    denyReason: string,
  ) => Promise<void>;
  @Prop() handleSaveResourcesOnAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
    resources: {
      facility: Facility;
      equipment: Equipment;
      medicine: Medicine;
    },
  ) => Promise<void>;
  @Prop() handleSelectPrescription: (prescription: PrescriptionDisplay) => void;
  @Prop() handleUpdatePrescriptionForAppointment: (
    appointment: PatientAppointment | DoctorAppointment,
    prescriptionId: string,
    updatedPrescription: PrescriptionDisplay,
  ) => Promise<void>;
  @Prop() handleAddPrescriptionForAppointment: (
    appointment: DoctorAppointment,
    newPrescription: NewPrescription,
  ) => Promise<Prescription | undefined>;

  @State() appointment: PatientAppointment | DoctorAppointment = undefined;
  @State() availableEquipment: Array<Equipment> = [{ id: 'equipment-1', name: 'Equipment 1' }];
  @State() availableFacilities: Array<Facility> = [{ id: 'facility-1', name: 'Facility 1' }];
  @State() availableMedicine: Array<Medicine> = [{ id: 'medicine-1', name: 'Medicine 1' }];

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
        const appointment: DoctorAppointment = await this.api.appointments.doctorsAppointment({
          doctorId: this.user.id,
          appointmentId: this.appointmentId,
        });
        this.appointment = appointment;
        this.selectedEquipment = appointment.equipment?.[0] ?? null;
        this.selectedFacility = appointment.facilities?.[0] ?? null;
        this.selectedMedicine = appointment.medicine?.[0] ?? null;
      } else {
        this.appointment = await this.api.appointments.patientsAppointment({
          patientId: this.user.id,
          appointmentId: this.appointmentId,
        });
      }
    } catch (err) {
      if (!(err instanceof ApiError)) {
        toastService.showError(err);
        return;
      }
      toastService.showError(err.message);
    }
  }

  @State() prescriptionsExpanded: boolean = false;
  @State() showEditResources: boolean = false;

  @State() addingPrescription: boolean = false;
  @State() addingPrescriptionName: string = '';
  @State() addingPrescriptionStart: Date = new Date();
  @State() addingPrescriptionEnd: Date = new Date(new Date().setDate(new Date().getDate() + 7));
  @State() addingPrescriptionDoctorsNote: string = '';

  @State() editingPrescription: PrescriptionDisplay = null;
  @State() editingPrescriptionNewName: string = '';
  @State() editingPrescriptionNewStart: Date = null;
  @State() editingPrescriptionNewEnd: Date = null;
  @State() editingPrescriptionNewDoctorsNote: string = '';

  @State() rescheduling: boolean = false;
  @State() reschedulingAppointmentDate: Date = null;
  @State() reschedulingAppointmentTime: string = '';
  @State() reschedulingAppointmentDoctor: Doctor = null;
  @State() reschedulingAppointmentReason: string = '';

  @State() cancelling: boolean = false;
  @State() cancellingAppointmentReason: string = '';

  @State() denying: boolean = false;
  @State() denyingAppointmentReason: string = '';

  @State() availableTimes: Array<TimeSlot> = [
    { time: '7:00', status: 'unavailable' } satisfies TimeSlot,
    { time: '8:00', status: 'available' } satisfies TimeSlot,
    { time: '9:00', status: 'unavailable' } satisfies TimeSlot,
    { time: '10:00', status: 'unavailable' } satisfies TimeSlot,
    { time: '11:00', status: 'available' } satisfies TimeSlot,
  ] satisfies Array<TimeSlot>;
  @State() availableDoctors: Array<Doctor> = [
    {
      id: 'available-doctor-1',
      firstName: 'Available',
      lastName: 'Doctor',
      email: 'available@doctor.sk',
      role: 'doctor',
      specialization: 'urologist',
    } satisfies Doctor,
  ] satisfies Array<Doctor>;

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

  private handleUpdatePrescriptionDateChange = (
    type: 'start' | 'end',
    part: 'day' | 'month' | 'year',
    event: Event,
  ) => {
    const value: number = parseInt((event.target as HTMLSelectElement).value, 10);
    if (type === 'start') {
      this.editingPrescriptionNewStart = updateDatePart(
        this.editingPrescriptionNewStart,
        part,
        value,
      );
    } else {
      this.editingPrescriptionNewEnd = updateDatePart(this.editingPrescriptionNewEnd, part, value);
    }
  };

  private handleUpdatePrescriptionDoctorsNoteChange = (event: Event) => {
    this.editingPrescriptionNewDoctorsNote = (event.target as HTMLSelectElement).value;
  };

  private handleAddPrescriptionNameChange = (event: Event) => {
    this.addingPrescriptionName = (event.target as HTMLSelectElement).value;
  };

  private handleAddPrescriptionDateChange = (
    type: 'start' | 'end',
    part: 'day' | 'month' | 'year',
    event: Event,
  ) => {
    const value: number = parseInt((event.target as HTMLSelectElement).value, 10);
    if (type === 'start') {
      this.addingPrescriptionStart = updateDatePart(this.addingPrescriptionStart, part, value);
    } else {
      this.addingPrescriptionEnd = updateDatePart(this.addingPrescriptionEnd, part, value);
    }
  };

  private handleAddPrescriptionDoctorsNoteChange = (event: Event) => {
    this.addingPrescriptionDoctorsNote = (event.target as HTMLSelectElement).value;
  };

  private handleReschedule = () => {
    if (
      this.reschedulingAppointmentDate &&
      this.reschedulingAppointmentTime &&
      this.reschedulingAppointmentDoctor
    ) {
      const newDateTime = new Date(this.reschedulingAppointmentDate);
      const [hours, minutes] = this.reschedulingAppointmentTime.split(':').map(Number);
      newDateTime.setHours(hours);
      newDateTime.setMinutes(minutes);

      this.handleRescheduleAppointment(
        this.appointment,
        newDateTime,
        this.reschedulingAppointmentDoctor,
        this.reschedulingAppointmentReason,
      ).then(() => {
        this.appointment = {
          ...this.appointment,
          status: 'requested',
          facilities: [],
          equipment: [],
          medicine: [],
          appointmentDateTime: newDateTime,
          doctor: this.reschedulingAppointmentDoctor,
        };
        this.rescheduling = false;
      });
    }
  };

  private handleCancel = () => {
    this.handleCancelAppointment(this.appointment, this.cancellingAppointmentReason).then(() => {
      this.appointment = {
        ...this.appointment,
        status: 'cancelled',
      };
      this.cancelling = false;
    });
  };

  private handleAccept = () => {
    this.handleAcceptAppointment(this.appointment).then(() => {
      this.appointment = {
        ...this.appointment,
        status: 'scheduled',
      };
    });
  };

  private handleDeny = () => {
    this.handleDenyAppointment(this.appointment, this.denyingAppointmentReason).then(() => {
      this.appointment = {
        ...this.appointment,
        status: 'denied',
      };
      this.denying = false;
    });
  };

  private handleSaveResources = () => {
    const newResources: {
      facility: Facility;
      equipment: Equipment;
      medicine: Medicine;
    } = {
      facility: this.selectedFacility,
      equipment: this.selectedEquipment,
      medicine: this.selectedMedicine,
    };

    this.handleSaveResourcesOnAppointment(this.appointment, newResources).then(() => {
      this.appointment = {
        ...this.appointment,
        facilities: [newResources.facility],
        equipment: [newResources.equipment],
        medicine: [newResources.medicine],
      };
      this.showEditResources = false;
    });
  };

  private handleAddPrescription = () => {
    if (!instanceOfDoctorAppointment(this.appointment)) {
      throw new Error('unexpected state, appointment is not DoctorAppointment');
    }

    const newPrescription: NewPrescription = {
      name: this.addingPrescriptionName,
      start: this.addingPrescriptionStart,
      end: this.addingPrescriptionEnd,
      doctorsNote: this.addingPrescriptionDoctorsNote,
      patientId: this.appointment.patient.id,
    };

    this.handleAddPrescriptionForAppointment(this.appointment, newPrescription).then(
      prescription => {
        if (!prescription) return;

        if (!this.appointment.prescriptions) {
          this.appointment.prescriptions = [prescription];
        } else {
          this.appointment.prescriptions.push(prescription);
        }

        this.addingPrescription = false;
        this.addingPrescriptionName = '';
        this.addingPrescriptionStart = new Date();
        this.addingPrescriptionEnd = new Date(new Date().setDate(new Date().getDate() + 7));
        this.addingPrescriptionDoctorsNote = '';
      },
    );
  };

  private handleUpdatePrescription = () => {
    const updatedPrescription: PrescriptionDisplay & { doctorsNote?: string } = {
      id: this.editingPrescription.id,
      name: this.editingPrescriptionNewName,
      start: this.editingPrescriptionNewStart,
      end: this.editingPrescriptionNewEnd,
      appointmentId: this.editingPrescription.appointmentId,
      doctorsNote: this.editingPrescriptionNewDoctorsNote,
    };

    this.handleUpdatePrescriptionForAppointment(
      this.appointment,
      this.editingPrescription.id,
      updatedPrescription,
    ).then(() => {
      const index: number = this.appointment.prescriptions.findIndex(
        (prescription: PrescriptionDisplay) => prescription.id === this.editingPrescription.id,
      );
      if (index !== -1) {
        this.appointment.prescriptions[index] = updatedPrescription;
      }
      this.editingPrescription = null;
    });
  };

  private renderDateSelects(
    dateType: 'start' | 'end',
    dateValue: Date | null,
    changeHandler: (type: 'start' | 'end', part: 'day' | 'month' | 'year', event: Event) => void,
  ) {
    const prefix: 'Start' | 'End' = dateType === 'start' ? 'Start' : 'End';
    return (
      <div class="flex w-full max-w-md flex-row justify-between gap-x-3">
        <md-outlined-select
          required={true}
          label={`${prefix} Day`}
          class="min-w-0 flex-1"
          value={getDatePart(dateValue, 'day')}
          onInput={(e: Event) => changeHandler(dateType, 'day', e)}
        >
          {days.map((day: number) => (
            <md-select-option value={day.toString()} key={`${dateType}-day-${day}`}>
              <div slot="headline">{day}</div>
            </md-select-option>
          ))}
        </md-outlined-select>

        <md-outlined-select
          required={true}
          label={`${prefix} Month`}
          class="min-w-0 flex-1"
          value={getDatePart(dateValue, 'month')}
          onInput={(e: Event) => changeHandler(dateType, 'month', e)}
        >
          {months.map((month: { value: number; name: string }) => (
            <md-select-option
              value={month.value.toString()}
              key={`${dateType}-month-${month.value}`}
            >
              <div slot="headline">{month.name}</div>
            </md-select-option>
          ))}
        </md-outlined-select>

        <md-outlined-select
          required={true}
          label={`${prefix} Year`}
          class="min-w-0 flex-1"
          value={getDatePart(dateValue, 'year')}
          onInput={(e: Event) => changeHandler(dateType, 'year', e)}
        >
          {years.map((year: number) => (
            <md-select-option value={year.toString()} key={`${dateType}-year-${year}`}>
              <div slot="headline">{year}</div>
            </md-select-option>
          ))}
        </md-outlined-select>
      </div>
    );
  }

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
          <div class="flex flex-row items-center gap-x-2 text-gray-500">
            <md-icon style={{ fontSize: '16px' }}>description</md-icon>
            Reason
          </div>
          {this.appointment.reason && (
            <p class="mt-1 ml-1 text-sm font-medium text-wrap text-gray-600">
              {this.appointment.reason}
            </p>
          )}
        </div>

        {this.appointment.status === 'cancelled' && (
          <div class="mb-6 max-h-32 w-full max-w-md overflow-y-auto rounded-md bg-gray-200 px-4 py-3">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>description</md-icon>
              Cancellation reason
            </div>
            {this.appointment.cancellationReason && (
              <p class="mt-1 ml-1 text-sm font-medium text-wrap text-gray-600">
                {this.appointment.cancellationReason}
              </p>
            )}
          </div>
        )}

        {this.appointment.status === 'denied' && (
          <div class="mb-6 max-h-32 w-full max-w-md overflow-y-auto rounded-md bg-gray-200 px-4 py-3">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>description</md-icon>
              Denial reason
            </div>
            {this.appointment.cancellationReason && (
              <p class="mt-1 ml-1 text-sm font-medium text-wrap text-gray-600">
                {this.appointment.cancellationReason}
              </p>
            )}
          </div>
        )}

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
              <span class="font-medium text-gray-600">
                {this.appointment.facilities?.[0].name ?? ''}
              </span>
            </div>
            <div class="flex w-full flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-x-2 text-gray-500">
                <md-icon style={{ fontSize: '16px' }}>service_toolbox</md-icon>
                Equipment
              </div>
              <span class="font-medium text-gray-600">
                {this.appointment.equipment?.[0].name ?? ''}
              </span>
            </div>
            <div class="flex w-full flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-x-2 text-gray-500">
                <md-icon style={{ fontSize: '16px' }}>vaccines</md-icon>
                Medicine
              </div>
              <span class="font-medium text-gray-600">
                {this.appointment.medicine?.[0].name ?? ''}
              </span>
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

                  <div class="flex flex-row items-center justify-between gap-x-2">
                    <md-filled-button
                      class={`w-1/2 rounded-full bg-[#7357be]`}
                      onClick={this.handleSaveResources}
                    >
                      Save resources
                    </md-filled-button>

                    <md-outlined-button
                      class={`w-1/2 rounded-full`}
                      onClick={() => (this.showEditResources = false)}
                    >
                      Cancel
                    </md-outlined-button>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Prescriptions Box */}
        <div class="relative mb-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
          <div class="mb-2 flex flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-x-2 text-gray-500">
              <md-icon style={{ fontSize: '16px' }}>medication</md-icon>
              Prescriptions
              {instanceOfDoctorAppointment(this.appointment) &&
                (this.appointment.status === AppointmentStatus.Completed ||
                  this.appointment.status === AppointmentStatus.Scheduled) && (
                  <md-icon-button
                    title="Add a prescription"
                    class="ml-2"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                      this.addingPrescription = !this.addingPrescription;
                      this.editingPrescription = null;
                    }}
                  >
                    <md-icon style={{ fontSize: '16px' }}>add</md-icon>
                  </md-icon-button>
                )}
            </div>
            {this.appointment.prescriptions && this.appointment.prescriptions.length > 0 && (
              <md-icon-button
                title={this.prescriptionsExpanded ? 'Collapse' : 'Expand'}
                onClick={() => (this.prescriptionsExpanded = !this.prescriptionsExpanded)}
                style={{ width: '24px', height: '24px' }}
              >
                <md-icon style={{ fontSize: '16px' }}>
                  {this.prescriptionsExpanded ? 'expand_less' : 'expand_more'}
                </md-icon>
              </md-icon-button>
            )}
          </div>

          {/* Prescription List or Message */}
          {(!this.appointment.prescriptions || this.appointment.prescriptions.length <= 0) &&
          !this.addingPrescription &&
          !this.editingPrescription ? (
            <div class="text-sm font-medium text-gray-600">
              No prescriptions for this appointment.
            </div>
          ) : this.prescriptionsExpanded ? (
            <div class="max-h-28 w-full overflow-y-auto rounded-md bg-gray-200">
              {/* ... Prescription list mapping ... (unchanged) */}
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
                  {instanceOfDoctorAppointment(this.appointment) &&
                    (this.appointment.status === AppointmentStatus.Completed ||
                      this.appointment.status === AppointmentStatus.Scheduled) && (
                      <md-icon-button
                        title="Edit prescription"
                        onClick={(event: Event) => {
                          event.stopPropagation();
                          this.editingPrescriptionNewName = prescription.name;
                          this.editingPrescriptionNewStart = prescription.start
                            ? new Date(prescription.start)
                            : null;
                          this.editingPrescriptionNewEnd = prescription.end
                            ? new Date(prescription.end)
                            : null;
                          // this.editingPrescriptionNewDoctorsNote = prescription.doctorsNote ?? '';
                          this.editingPrescription = prescription;
                          this.addingPrescription = false;
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
            !this.addingPrescription &&
            !this.editingPrescription && (
              <div class="ml-2 text-sm font-medium text-gray-600">
                {this.appointment.prescriptions?.length ?? 0} prescription
                {this.appointment.prescriptions?.length !== 1 ? 's' : ''}
              </div>
            )
          )}

          {/* Edit Prescription Form */}
          {this.isDoctor &&
            instanceOfDoctorAppointment(this.appointment) &&
            this.editingPrescription && (
              <div class="mt-3 w-full pt-3">
                <h4 class="mb-2 text-sm font-medium text-[#7357be]">Edit prescription</h4>
                <div class="mb-3 flex w-full flex-col gap-y-3">
                  <md-outlined-text-field
                    required={true}
                    label="Prescription name"
                    class="w-full"
                    value={this.editingPrescriptionNewName}
                    onInput={(e: Event) => this.handleUpdatePrescriptionNameChange(e)}
                  />

                  {this.renderDateSelects(
                    'start',
                    this.editingPrescriptionNewStart,
                    this.handleUpdatePrescriptionDateChange,
                  )}

                  {this.renderDateSelects(
                    'end',
                    this.editingPrescriptionNewEnd,
                    this.handleUpdatePrescriptionDateChange,
                  )}

                  <md-outlined-text-field
                    type="textarea"
                    rows={2}
                    label="Doctor's note (optional)"
                    class="w-full"
                    value={this.editingPrescriptionNewDoctorsNote}
                    onInput={(e: Event) => this.handleUpdatePrescriptionDoctorsNoteChange(e)}
                  />
                </div>

                {/* Save/Cancel Buttons */}
                <div class="flex gap-x-2">
                  <md-filled-button
                    class={`flex-1 rounded-full bg-[#7357be]`}
                    disabled={
                      !this.editingPrescriptionNewName ||
                      !this.editingPrescriptionNewStart ||
                      !this.editingPrescriptionNewEnd
                    }
                    onClick={this.handleUpdatePrescription}
                  >
                    Save Changes
                  </md-filled-button>
                  <md-outlined-button
                    class="flex-1 rounded-full"
                    onClick={() => (this.editingPrescription = null)}
                  >
                    Cancel
                  </md-outlined-button>
                </div>
              </div>
            )}

          {/* Add Prescription Form */}
          {this.isDoctor &&
            instanceOfDoctorAppointment(this.appointment) &&
            this.addingPrescription && (
              <div class="mt-3 w-full pt-3">
                <h4 class="mb-2 text-sm font-medium text-[#7357be]">Add a new prescription</h4>
                <div class="mb-3 flex w-full flex-col gap-y-3">
                  <md-outlined-text-field
                    required={true}
                    label="Prescription name"
                    class="w-full"
                    value={this.addingPrescriptionName}
                    onInput={(e: Event) => this.handleAddPrescriptionNameChange(e)}
                  />

                  {this.renderDateSelects(
                    'start',
                    this.addingPrescriptionStart,
                    this.handleAddPrescriptionDateChange,
                  )}

                  {this.renderDateSelects(
                    'end',
                    this.addingPrescriptionEnd,
                    this.handleAddPrescriptionDateChange,
                  )}

                  <md-outlined-text-field
                    type="textarea"
                    rows={2}
                    label="Doctor's note (optional)"
                    class="w-full"
                    value={this.addingPrescriptionDoctorsNote}
                    onInput={(e: Event) => this.handleAddPrescriptionDoctorsNoteChange(e)}
                  />
                </div>

                <div class="flex gap-x-2">
                  <md-filled-button
                    class={`flex-1 rounded-full bg-[#7357be]`}
                    disabled={
                      !this.addingPrescriptionName ||
                      !this.addingPrescriptionStart ||
                      !this.addingPrescriptionEnd
                    }
                    onClick={this.handleAddPrescription}
                  >
                    Add Prescription
                  </md-filled-button>
                  <md-outlined-button
                    class="flex-1 rounded-full"
                    onClick={() => (this.addingPrescription = false)}
                  >
                    Cancel
                  </md-outlined-button>
                </div>
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
              () => {
                this.cancelling = !this.cancelling;
                this.rescheduling = false;
                this.denying = false;
              },
              this.handleAccept,
              () => {
                this.denying = !this.denying;
                this.cancelling = false;
                this.rescheduling = false;
              },
            )
          : getPatientAppointmentActions(
              this.appointment.status,
              () => {
                this.rescheduling = !this.rescheduling;
                this.cancelling = false;
                this.denying = false;
              },
              () => {
                this.cancelling = !this.cancelling;
                this.rescheduling = false;
                this.denying = false;
              },
            )}

        {this.rescheduling && !this.isDoctor && (
          <div class="my-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
            <h4 class="mb-2 text-sm font-medium text-[#7357be]">Re-schedule appointment</h4>
            <div class="mb-3 flex w-full flex-col gap-y-3">
              {this.renderDateSelects(
                'start',
                this.reschedulingAppointmentDate,
                (type: 'start' | 'end', part: 'day' | 'month' | 'year', event: Event) => {
                  const value: number = parseInt((event.target as HTMLSelectElement).value, 10);
                  this.reschedulingAppointmentDate = updateDatePart(
                    this.reschedulingAppointmentDate,
                    part,
                    value,
                  );
                },
              )}

              <md-outlined-select
                label="Time"
                class="w-full"
                value={this.reschedulingAppointmentTime}
                onInput={(e: Event) =>
                  (this.reschedulingAppointmentTime = (e.target as HTMLSelectElement).value)
                }
              >
                {this.availableTimes.map((timeSlot: TimeSlot) => (
                  <md-select-option
                    value={timeSlot.time}
                    disabled={timeSlot.status !== 'available'}
                  >
                    <div slot="headline">{timeSlot.time}</div>
                  </md-select-option>
                ))}
              </md-outlined-select>

              <md-outlined-select
                label="Doctor"
                class="w-full"
                value={this.reschedulingAppointmentDoctor?.id}
                onInput={(e: Event) => {
                  const newDoctorId: string = (e.target as HTMLSelectElement).value;
                  this.reschedulingAppointmentDoctor = this.availableDoctors.find(
                    (doctor: Doctor) => doctor.id === newDoctorId,
                  );
                }}
              >
                {this.availableDoctors.map((doctor: Doctor) => (
                  <md-select-option value={doctor.id}>
                    <div slot="headline">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </div>
                  </md-select-option>
                ))}
              </md-outlined-select>

              <md-outlined-text-field
                label="Rescheduling reason (optional)"
                class="w-full"
                value={this.reschedulingAppointmentReason}
                onInput={(e: Event) => {
                  this.reschedulingAppointmentReason = (e.target as HTMLInputElement).value;
                }}
              />
            </div>

            <div class="flex gap-x-2">
              <md-filled-button
                class={`flex-1 rounded-full bg-[#7357be]`}
                disabled={
                  !this.reschedulingAppointmentDate ||
                  !this.reschedulingAppointmentTime ||
                  !this.reschedulingAppointmentDoctor
                }
                onClick={this.handleReschedule}
              >
                Re-schedule
              </md-filled-button>
              <md-outlined-button
                class="flex-1 rounded-full"
                onClick={() => (this.rescheduling = false)}
              >
                Cancel
              </md-outlined-button>
            </div>
          </div>
        )}

        {this.cancelling && (
          <div class="my-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
            <h4 class="mb-2 text-sm font-medium text-[#7357be]">Cancel appointment</h4>
            <div class="mb-3 flex w-full flex-col gap-y-3">
              <md-outlined-text-field
                required={true}
                label="Cancellation reason"
                class="w-full"
                value={this.cancellingAppointmentReason}
                onInput={(e: Event) => {
                  this.cancellingAppointmentReason = (e.target as HTMLInputElement).value;
                }}
              />
            </div>

            <div class="flex flex-row items-center justify-between gap-x-2">
              <md-filled-button
                class={`w-1/2 rounded-full bg-[#7357be]`}
                onClick={this.handleCancel}
                disabled={this.cancellingAppointmentReason === ''}
              >
                Confirm cancel
              </md-filled-button>
              <md-outlined-button
                class="w-1/2 rounded-full"
                onClick={() => (this.cancelling = false)}
              >
                Back
              </md-outlined-button>
            </div>
          </div>
        )}

        {this.denying && this.isDoctor && (
          <div class="my-6 w-full max-w-md rounded-md bg-gray-200 px-4 py-3">
            <h4 class="mb-2 text-sm font-medium text-[#7357be]">Deny appointment request</h4>
            <div class="mb-3 flex w-full flex-col gap-y-3">
              <md-outlined-text-field
                required={true}
                label="Reason for denying"
                class="w-full"
                value={this.denyingAppointmentReason}
                onInput={(e: Event) => {
                  this.denyingAppointmentReason = (e.target as HTMLInputElement).value;
                }}
              />
            </div>

            <div class="flex flex-row items-center justify-between gap-x-2">
              <md-filled-button
                class={`w-1/2 rounded-full bg-[#7357be]`}
                onClick={this.handleDeny}
                disabled={this.denyingAppointmentReason === ''}
              >
                Confirm deny
              </md-filled-button>
              <md-outlined-button class="w-1/2 rounded-full" onClick={() => (this.denying = false)}>
                Back
              </md-outlined-button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

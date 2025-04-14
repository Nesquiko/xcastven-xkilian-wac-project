/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Api } from "./api/api";
import { AppointmentDisplay, AppointmentStatus, Condition, ConditionDisplay, Doctor, DoctorAppointment, Equipment, Facility, Medicine, PatientAppointment, Prescription, PrescriptionDisplay, User, UserRole } from "./api/generated";
import { User as User1 } from "./components";
export { Api } from "./api/api";
export { AppointmentDisplay, AppointmentStatus, Condition, ConditionDisplay, Doctor, DoctorAppointment, Equipment, Facility, Medicine, PatientAppointment, Prescription, PrescriptionDisplay, User, UserRole } from "./api/generated";
export { User as User1 } from "./components";
export namespace Components {
    interface XcastvenXkilianProjectAccount {
    }
    interface XcastvenXkilianProjectApp {
        "apiBase": string;
        "basePath": string;
    }
    interface XcastvenXkilianProjectAppointmentDetail {
        "api": Api;
        "appointmentId": string;
        "handleAcceptAppointment": (appointment: PatientAppointment | DoctorAppointment) => void;
        "handleAddPrescriptionForAppointment": (
    appointment: PatientAppointment | DoctorAppointment,
    newPrescription: Prescription,
  ) => void;
        "handleCancelAppointment": (
    appointment: PatientAppointment | DoctorAppointment,
    cancellationReason: string,
  ) => void;
        "handleDenyAppointment": (appointment: PatientAppointment | DoctorAppointment) => void;
        "handleRescheduleAppointment": (
    appointment: PatientAppointment | DoctorAppointment,
    newAppointmentDateTime: Date,
    newAppointmentDoctor: Doctor,
    reason: string,
  ) => void;
        "handleResetSelection": () => void;
        "handleSaveResourcesOnAppointment": (
    appointment: PatientAppointment | DoctorAppointment,
    resources: {
      facility: Facility;
      equipment: Equipment;
      medicine: Medicine;
    },
  ) => void;
        "handleSelectPrescription": (prescription: PrescriptionDisplay) => void;
        "handleUpdatePrescriptionForAppointment": (
    appointment: PatientAppointment | DoctorAppointment,
    prescriptionId: string,
    updatedPrescription: PrescriptionDisplay,
  ) => void;
        "isDoctor": boolean;
        "user": User;
    }
    interface XcastvenXkilianProjectAppointmentScheduler {
        "api": Api;
        "initialDate": Date;
        "user": User;
    }
    interface XcastvenXkilianProjectAppointmentsList {
        "appointments": Array<AppointmentDisplay>;
        "currentDate": Date;
        "handleSelectAppointment": (appointment: AppointmentDisplay) => void;
        "isDoctor": boolean;
        "noDataMessage": string;
        "user": User;
    }
    interface XcastvenXkilianProjectCalendar {
        "appointments": Array<AppointmentDisplay>;
        "conditions": Array<ConditionDisplay>;
        "currentViewMonth": number;
        "currentViewYear": number;
        "getConditionsForDate": (date: Date) => Array<ConditionDisplay>;
        "getPrescriptionsForDate": (date: Date) => Array<PrescriptionDisplay>;
        "handleNextMonth": () => void;
        "handlePreviousMonth": () => void;
        "handleSelectAppointment": (appointment: AppointmentDisplay) => void;
        "handleSelectAppointmentStatusGroup": (date: Date, status: AppointmentStatus) => void;
        "handleSelectCondition": (condition: ConditionDisplay) => void;
        "handleSelectDate": (date: Date) => void;
        "handleSelectPrescription": (prescription: PrescriptionDisplay) => void;
        "hoveredConditionId": string;
        "hoveredPrescriptionId": string;
        "isDoctor": boolean;
        "prescriptions": Array<PrescriptionDisplay>;
        "setHoveredConditionId": (value: string | null) => void;
        "setHoveredPrescriptionId": (value: string | null) => void;
        "user": { email: string; role: UserRole };
    }
    interface XcastvenXkilianProjectConditionDetail {
        "api": Api;
        "conditionId": string;
        "handleResetSelection": () => void;
        "handleScheduleAppointmentFromCondition": (condition: Condition) => void;
        "handleSelectAppointment": (appointment: AppointmentDisplay) => void;
        "handleToggleConditionStatus": (condition: Condition) => void;
    }
    interface XcastvenXkilianProjectConditionRegisterer {
        "api": Api;
        "startDate": Date;
        "user": User1;
    }
    interface XcastvenXkilianProjectConditionsList {
        "conditions": Array<ConditionDisplay>;
        "currentDate": Date;
        "handleSelectCondition": (condition: ConditionDisplay) => void;
    }
    interface XcastvenXkilianProjectDatePicker {
        "currentViewMonth": number;
        "currentViewYear": number;
        "selectDate": (day: number) => void;
        "selectedDate": Date;
    }
    interface XcastvenXkilianProjectDrawer {
        "activeTab": number;
        "api": Api;
        "getAppointmentsForDate": (date: Date) => Array<AppointmentDisplay>;
        "getAppointmentsForDateByStatus": (
    date: Date,
    appointmentStatus: AppointmentStatus,
  ) => Array<AppointmentDisplay>;
        "getConditionsForDate": (date: Date) => Array<ConditionDisplay>;
        "getPrescriptionsForDate": (date: Date) => Array<PrescriptionDisplay>;
        "handleAcceptAppointment": (appointment: PatientAppointment | DoctorAppointment) => void;
        "handleAddPrescriptionForAppointment": (
    appointment: PatientAppointment | DoctorAppointment,
    newPrescription: Prescription,
  ) => void;
        "handleCancelAppointment": (
    appointment: PatientAppointment | DoctorAppointment,
    cancellationReason: string,
  ) => void;
        "handleDenyAppointment": (appointment: PatientAppointment | DoctorAppointment) => void;
        "handleRescheduleAppointment": (
    appointment: PatientAppointment | DoctorAppointment,
    newAppointmentDateTime: Date,
    newAppointmentDoctor: Doctor,
    reason: string,
  ) => void;
        "handleResetSelection": () => void;
        "handleSaveResourcesOnAppointment": (
    appointment: PatientAppointment | DoctorAppointment,
    resources: {
      facility: Facility;
      equipment: Equipment;
      medicine: Medicine;
    },
  ) => void;
        "handleScheduleAppointmentFromCondition": (condition: Condition) => void;
        "handleSelectAppointment": (appointment: AppointmentDisplay) => void;
        "handleSelectCondition": (condition: ConditionDisplay) => void;
        "handleSelectPrescription": (prescription: PrescriptionDisplay) => void;
        "handleTabChange": (event: Event) => void;
        "handleToggleConditionStatus": (condition: Condition) => void;
        "handleUpdatePrescriptionForAppointment": (
    appointment: PatientAppointment | DoctorAppointment,
    prescriptionId: string,
    updatedPrescription: PrescriptionDisplay,
  ) => void;
        "isDoctor": boolean;
        "isDrawerOpen": boolean;
        "selectedAppointment": AppointmentDisplay;
        "selectedAppointmentStatusGroup": AppointmentStatus;
        "selectedCondition": ConditionDisplay;
        "selectedDate": Date;
        "selectedPrescription": PrescriptionDisplay;
        "showLegend": boolean;
        "user": User;
    }
    interface XcastvenXkilianProjectFooter {
        "handleToggleLegendMenu": () => void;
        "isDoctor": boolean;
    }
    interface XcastvenXkilianProjectHeader {
        "currentViewMonth"?: number;
        "currentViewYear"?: number;
        "handleNextMonth"?: () => void;
        "handlePreviousMonth"?: () => void;
        "handleYearChange"?: (event: Event) => void;
        "type": 'calendar' | 'account' | 'scheduleAppointment' | 'registerCondition';
    }
    interface XcastvenXkilianProjectHomePage {
        "api": Api;
    }
    interface XcastvenXkilianProjectLegend {
        "handleResetSelection": () => void;
    }
    interface XcastvenXkilianProjectLogin {
        "api": Api;
    }
    interface XcastvenXkilianProjectMenu {
        "handleResetMenu": () => void;
        "isMenuOpen": boolean;
    }
    interface XcastvenXkilianProjectPrescriptionDetail {
        "handleResetSelection": () => void;
        "prescriptionId": string;
    }
    interface XcastvenXkilianProjectPrescriptionsList {
        "handleSelectPrescription": (prescription: PrescriptionDisplay) => void;
        "prescriptions": Array<PrescriptionDisplay>;
    }
    interface XcastvenXkilianProjectRegister {
        "api": Api;
    }
    interface XcastvenXkilianProjectToast {
        "duration": number;
        "show": (message: string, type?: "success" | "error" | "info", duration?: number) => Promise<void>;
    }
}
declare global {
    interface HTMLXcastvenXkilianProjectAccountElement extends Components.XcastvenXkilianProjectAccount, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectAccountElement: {
        prototype: HTMLXcastvenXkilianProjectAccountElement;
        new (): HTMLXcastvenXkilianProjectAccountElement;
    };
    interface HTMLXcastvenXkilianProjectAppElement extends Components.XcastvenXkilianProjectApp, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectAppElement: {
        prototype: HTMLXcastvenXkilianProjectAppElement;
        new (): HTMLXcastvenXkilianProjectAppElement;
    };
    interface HTMLXcastvenXkilianProjectAppointmentDetailElement extends Components.XcastvenXkilianProjectAppointmentDetail, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectAppointmentDetailElement: {
        prototype: HTMLXcastvenXkilianProjectAppointmentDetailElement;
        new (): HTMLXcastvenXkilianProjectAppointmentDetailElement;
    };
    interface HTMLXcastvenXkilianProjectAppointmentSchedulerElement extends Components.XcastvenXkilianProjectAppointmentScheduler, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectAppointmentSchedulerElement: {
        prototype: HTMLXcastvenXkilianProjectAppointmentSchedulerElement;
        new (): HTMLXcastvenXkilianProjectAppointmentSchedulerElement;
    };
    interface HTMLXcastvenXkilianProjectAppointmentsListElement extends Components.XcastvenXkilianProjectAppointmentsList, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectAppointmentsListElement: {
        prototype: HTMLXcastvenXkilianProjectAppointmentsListElement;
        new (): HTMLXcastvenXkilianProjectAppointmentsListElement;
    };
    interface HTMLXcastvenXkilianProjectCalendarElement extends Components.XcastvenXkilianProjectCalendar, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectCalendarElement: {
        prototype: HTMLXcastvenXkilianProjectCalendarElement;
        new (): HTMLXcastvenXkilianProjectCalendarElement;
    };
    interface HTMLXcastvenXkilianProjectConditionDetailElement extends Components.XcastvenXkilianProjectConditionDetail, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectConditionDetailElement: {
        prototype: HTMLXcastvenXkilianProjectConditionDetailElement;
        new (): HTMLXcastvenXkilianProjectConditionDetailElement;
    };
    interface HTMLXcastvenXkilianProjectConditionRegistererElement extends Components.XcastvenXkilianProjectConditionRegisterer, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectConditionRegistererElement: {
        prototype: HTMLXcastvenXkilianProjectConditionRegistererElement;
        new (): HTMLXcastvenXkilianProjectConditionRegistererElement;
    };
    interface HTMLXcastvenXkilianProjectConditionsListElement extends Components.XcastvenXkilianProjectConditionsList, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectConditionsListElement: {
        prototype: HTMLXcastvenXkilianProjectConditionsListElement;
        new (): HTMLXcastvenXkilianProjectConditionsListElement;
    };
    interface HTMLXcastvenXkilianProjectDatePickerElement extends Components.XcastvenXkilianProjectDatePicker, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectDatePickerElement: {
        prototype: HTMLXcastvenXkilianProjectDatePickerElement;
        new (): HTMLXcastvenXkilianProjectDatePickerElement;
    };
    interface HTMLXcastvenXkilianProjectDrawerElement extends Components.XcastvenXkilianProjectDrawer, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectDrawerElement: {
        prototype: HTMLXcastvenXkilianProjectDrawerElement;
        new (): HTMLXcastvenXkilianProjectDrawerElement;
    };
    interface HTMLXcastvenXkilianProjectFooterElement extends Components.XcastvenXkilianProjectFooter, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectFooterElement: {
        prototype: HTMLXcastvenXkilianProjectFooterElement;
        new (): HTMLXcastvenXkilianProjectFooterElement;
    };
    interface HTMLXcastvenXkilianProjectHeaderElement extends Components.XcastvenXkilianProjectHeader, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectHeaderElement: {
        prototype: HTMLXcastvenXkilianProjectHeaderElement;
        new (): HTMLXcastvenXkilianProjectHeaderElement;
    };
    interface HTMLXcastvenXkilianProjectHomePageElement extends Components.XcastvenXkilianProjectHomePage, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectHomePageElement: {
        prototype: HTMLXcastvenXkilianProjectHomePageElement;
        new (): HTMLXcastvenXkilianProjectHomePageElement;
    };
    interface HTMLXcastvenXkilianProjectLegendElement extends Components.XcastvenXkilianProjectLegend, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectLegendElement: {
        prototype: HTMLXcastvenXkilianProjectLegendElement;
        new (): HTMLXcastvenXkilianProjectLegendElement;
    };
    interface HTMLXcastvenXkilianProjectLoginElement extends Components.XcastvenXkilianProjectLogin, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectLoginElement: {
        prototype: HTMLXcastvenXkilianProjectLoginElement;
        new (): HTMLXcastvenXkilianProjectLoginElement;
    };
    interface HTMLXcastvenXkilianProjectMenuElement extends Components.XcastvenXkilianProjectMenu, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectMenuElement: {
        prototype: HTMLXcastvenXkilianProjectMenuElement;
        new (): HTMLXcastvenXkilianProjectMenuElement;
    };
    interface HTMLXcastvenXkilianProjectPrescriptionDetailElement extends Components.XcastvenXkilianProjectPrescriptionDetail, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectPrescriptionDetailElement: {
        prototype: HTMLXcastvenXkilianProjectPrescriptionDetailElement;
        new (): HTMLXcastvenXkilianProjectPrescriptionDetailElement;
    };
    interface HTMLXcastvenXkilianProjectPrescriptionsListElement extends Components.XcastvenXkilianProjectPrescriptionsList, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectPrescriptionsListElement: {
        prototype: HTMLXcastvenXkilianProjectPrescriptionsListElement;
        new (): HTMLXcastvenXkilianProjectPrescriptionsListElement;
    };
    interface HTMLXcastvenXkilianProjectRegisterElement extends Components.XcastvenXkilianProjectRegister, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectRegisterElement: {
        prototype: HTMLXcastvenXkilianProjectRegisterElement;
        new (): HTMLXcastvenXkilianProjectRegisterElement;
    };
    interface HTMLXcastvenXkilianProjectToastElement extends Components.XcastvenXkilianProjectToast, HTMLStencilElement {
    }
    var HTMLXcastvenXkilianProjectToastElement: {
        prototype: HTMLXcastvenXkilianProjectToastElement;
        new (): HTMLXcastvenXkilianProjectToastElement;
    };
    interface HTMLElementTagNameMap {
        "xcastven-xkilian-project-account": HTMLXcastvenXkilianProjectAccountElement;
        "xcastven-xkilian-project-app": HTMLXcastvenXkilianProjectAppElement;
        "xcastven-xkilian-project-appointment-detail": HTMLXcastvenXkilianProjectAppointmentDetailElement;
        "xcastven-xkilian-project-appointment-scheduler": HTMLXcastvenXkilianProjectAppointmentSchedulerElement;
        "xcastven-xkilian-project-appointments-list": HTMLXcastvenXkilianProjectAppointmentsListElement;
        "xcastven-xkilian-project-calendar": HTMLXcastvenXkilianProjectCalendarElement;
        "xcastven-xkilian-project-condition-detail": HTMLXcastvenXkilianProjectConditionDetailElement;
        "xcastven-xkilian-project-condition-registerer": HTMLXcastvenXkilianProjectConditionRegistererElement;
        "xcastven-xkilian-project-conditions-list": HTMLXcastvenXkilianProjectConditionsListElement;
        "xcastven-xkilian-project-date-picker": HTMLXcastvenXkilianProjectDatePickerElement;
        "xcastven-xkilian-project-drawer": HTMLXcastvenXkilianProjectDrawerElement;
        "xcastven-xkilian-project-footer": HTMLXcastvenXkilianProjectFooterElement;
        "xcastven-xkilian-project-header": HTMLXcastvenXkilianProjectHeaderElement;
        "xcastven-xkilian-project-home-page": HTMLXcastvenXkilianProjectHomePageElement;
        "xcastven-xkilian-project-legend": HTMLXcastvenXkilianProjectLegendElement;
        "xcastven-xkilian-project-login": HTMLXcastvenXkilianProjectLoginElement;
        "xcastven-xkilian-project-menu": HTMLXcastvenXkilianProjectMenuElement;
        "xcastven-xkilian-project-prescription-detail": HTMLXcastvenXkilianProjectPrescriptionDetailElement;
        "xcastven-xkilian-project-prescriptions-list": HTMLXcastvenXkilianProjectPrescriptionsListElement;
        "xcastven-xkilian-project-register": HTMLXcastvenXkilianProjectRegisterElement;
        "xcastven-xkilian-project-toast": HTMLXcastvenXkilianProjectToastElement;
    }
}
declare namespace LocalJSX {
    interface XcastvenXkilianProjectAccount {
    }
    interface XcastvenXkilianProjectApp {
        "apiBase"?: string;
        "basePath"?: string;
    }
    interface XcastvenXkilianProjectAppointmentDetail {
        "api"?: Api;
        "appointmentId"?: string;
        "handleAcceptAppointment"?: (appointment: PatientAppointment | DoctorAppointment) => void;
        "handleAddPrescriptionForAppointment"?: (
    appointment: PatientAppointment | DoctorAppointment,
    newPrescription: Prescription,
  ) => void;
        "handleCancelAppointment"?: (
    appointment: PatientAppointment | DoctorAppointment,
    cancellationReason: string,
  ) => void;
        "handleDenyAppointment"?: (appointment: PatientAppointment | DoctorAppointment) => void;
        "handleRescheduleAppointment"?: (
    appointment: PatientAppointment | DoctorAppointment,
    newAppointmentDateTime: Date,
    newAppointmentDoctor: Doctor,
    reason: string,
  ) => void;
        "handleResetSelection"?: () => void;
        "handleSaveResourcesOnAppointment"?: (
    appointment: PatientAppointment | DoctorAppointment,
    resources: {
      facility: Facility;
      equipment: Equipment;
      medicine: Medicine;
    },
  ) => void;
        "handleSelectPrescription"?: (prescription: PrescriptionDisplay) => void;
        "handleUpdatePrescriptionForAppointment"?: (
    appointment: PatientAppointment | DoctorAppointment,
    prescriptionId: string,
    updatedPrescription: PrescriptionDisplay,
  ) => void;
        "isDoctor"?: boolean;
        "user"?: User;
    }
    interface XcastvenXkilianProjectAppointmentScheduler {
        "api"?: Api;
        "initialDate"?: Date;
        "user"?: User;
    }
    interface XcastvenXkilianProjectAppointmentsList {
        "appointments"?: Array<AppointmentDisplay>;
        "currentDate"?: Date;
        "handleSelectAppointment"?: (appointment: AppointmentDisplay) => void;
        "isDoctor"?: boolean;
        "noDataMessage"?: string;
        "user"?: User;
    }
    interface XcastvenXkilianProjectCalendar {
        "appointments"?: Array<AppointmentDisplay>;
        "conditions"?: Array<ConditionDisplay>;
        "currentViewMonth"?: number;
        "currentViewYear"?: number;
        "getConditionsForDate"?: (date: Date) => Array<ConditionDisplay>;
        "getPrescriptionsForDate"?: (date: Date) => Array<PrescriptionDisplay>;
        "handleNextMonth"?: () => void;
        "handlePreviousMonth"?: () => void;
        "handleSelectAppointment"?: (appointment: AppointmentDisplay) => void;
        "handleSelectAppointmentStatusGroup"?: (date: Date, status: AppointmentStatus) => void;
        "handleSelectCondition"?: (condition: ConditionDisplay) => void;
        "handleSelectDate"?: (date: Date) => void;
        "handleSelectPrescription"?: (prescription: PrescriptionDisplay) => void;
        "hoveredConditionId"?: string;
        "hoveredPrescriptionId"?: string;
        "isDoctor"?: boolean;
        "prescriptions"?: Array<PrescriptionDisplay>;
        "setHoveredConditionId"?: (value: string | null) => void;
        "setHoveredPrescriptionId"?: (value: string | null) => void;
        "user"?: { email: string; role: UserRole };
    }
    interface XcastvenXkilianProjectConditionDetail {
        "api"?: Api;
        "conditionId"?: string;
        "handleResetSelection"?: () => void;
        "handleScheduleAppointmentFromCondition"?: (condition: Condition) => void;
        "handleSelectAppointment"?: (appointment: AppointmentDisplay) => void;
        "handleToggleConditionStatus"?: (condition: Condition) => void;
    }
    interface XcastvenXkilianProjectConditionRegisterer {
        "api"?: Api;
        "startDate"?: Date;
        "user"?: User1;
    }
    interface XcastvenXkilianProjectConditionsList {
        "conditions"?: Array<ConditionDisplay>;
        "currentDate"?: Date;
        "handleSelectCondition"?: (condition: ConditionDisplay) => void;
    }
    interface XcastvenXkilianProjectDatePicker {
        "currentViewMonth"?: number;
        "currentViewYear"?: number;
        "selectDate"?: (day: number) => void;
        "selectedDate"?: Date;
    }
    interface XcastvenXkilianProjectDrawer {
        "activeTab"?: number;
        "api"?: Api;
        "getAppointmentsForDate"?: (date: Date) => Array<AppointmentDisplay>;
        "getAppointmentsForDateByStatus"?: (
    date: Date,
    appointmentStatus: AppointmentStatus,
  ) => Array<AppointmentDisplay>;
        "getConditionsForDate"?: (date: Date) => Array<ConditionDisplay>;
        "getPrescriptionsForDate"?: (date: Date) => Array<PrescriptionDisplay>;
        "handleAcceptAppointment"?: (appointment: PatientAppointment | DoctorAppointment) => void;
        "handleAddPrescriptionForAppointment"?: (
    appointment: PatientAppointment | DoctorAppointment,
    newPrescription: Prescription,
  ) => void;
        "handleCancelAppointment"?: (
    appointment: PatientAppointment | DoctorAppointment,
    cancellationReason: string,
  ) => void;
        "handleDenyAppointment"?: (appointment: PatientAppointment | DoctorAppointment) => void;
        "handleRescheduleAppointment"?: (
    appointment: PatientAppointment | DoctorAppointment,
    newAppointmentDateTime: Date,
    newAppointmentDoctor: Doctor,
    reason: string,
  ) => void;
        "handleResetSelection"?: () => void;
        "handleSaveResourcesOnAppointment"?: (
    appointment: PatientAppointment | DoctorAppointment,
    resources: {
      facility: Facility;
      equipment: Equipment;
      medicine: Medicine;
    },
  ) => void;
        "handleScheduleAppointmentFromCondition"?: (condition: Condition) => void;
        "handleSelectAppointment"?: (appointment: AppointmentDisplay) => void;
        "handleSelectCondition"?: (condition: ConditionDisplay) => void;
        "handleSelectPrescription"?: (prescription: PrescriptionDisplay) => void;
        "handleTabChange"?: (event: Event) => void;
        "handleToggleConditionStatus"?: (condition: Condition) => void;
        "handleUpdatePrescriptionForAppointment"?: (
    appointment: PatientAppointment | DoctorAppointment,
    prescriptionId: string,
    updatedPrescription: PrescriptionDisplay,
  ) => void;
        "isDoctor"?: boolean;
        "isDrawerOpen"?: boolean;
        "selectedAppointment"?: AppointmentDisplay;
        "selectedAppointmentStatusGroup"?: AppointmentStatus;
        "selectedCondition"?: ConditionDisplay;
        "selectedDate"?: Date;
        "selectedPrescription"?: PrescriptionDisplay;
        "showLegend"?: boolean;
        "user"?: User;
    }
    interface XcastvenXkilianProjectFooter {
        "handleToggleLegendMenu"?: () => void;
        "isDoctor"?: boolean;
    }
    interface XcastvenXkilianProjectHeader {
        "currentViewMonth"?: number;
        "currentViewYear"?: number;
        "handleNextMonth"?: () => void;
        "handlePreviousMonth"?: () => void;
        "handleYearChange"?: (event: Event) => void;
        "type"?: 'calendar' | 'account' | 'scheduleAppointment' | 'registerCondition';
    }
    interface XcastvenXkilianProjectHomePage {
        "api"?: Api;
    }
    interface XcastvenXkilianProjectLegend {
        "handleResetSelection"?: () => void;
    }
    interface XcastvenXkilianProjectLogin {
        "api"?: Api;
    }
    interface XcastvenXkilianProjectMenu {
        "handleResetMenu"?: () => void;
        "isMenuOpen"?: boolean;
    }
    interface XcastvenXkilianProjectPrescriptionDetail {
        "handleResetSelection"?: () => void;
        "prescriptionId"?: string;
    }
    interface XcastvenXkilianProjectPrescriptionsList {
        "handleSelectPrescription"?: (prescription: PrescriptionDisplay) => void;
        "prescriptions"?: Array<PrescriptionDisplay>;
    }
    interface XcastvenXkilianProjectRegister {
        "api"?: Api;
    }
    interface XcastvenXkilianProjectToast {
        "duration"?: number;
    }
    interface IntrinsicElements {
        "xcastven-xkilian-project-account": XcastvenXkilianProjectAccount;
        "xcastven-xkilian-project-app": XcastvenXkilianProjectApp;
        "xcastven-xkilian-project-appointment-detail": XcastvenXkilianProjectAppointmentDetail;
        "xcastven-xkilian-project-appointment-scheduler": XcastvenXkilianProjectAppointmentScheduler;
        "xcastven-xkilian-project-appointments-list": XcastvenXkilianProjectAppointmentsList;
        "xcastven-xkilian-project-calendar": XcastvenXkilianProjectCalendar;
        "xcastven-xkilian-project-condition-detail": XcastvenXkilianProjectConditionDetail;
        "xcastven-xkilian-project-condition-registerer": XcastvenXkilianProjectConditionRegisterer;
        "xcastven-xkilian-project-conditions-list": XcastvenXkilianProjectConditionsList;
        "xcastven-xkilian-project-date-picker": XcastvenXkilianProjectDatePicker;
        "xcastven-xkilian-project-drawer": XcastvenXkilianProjectDrawer;
        "xcastven-xkilian-project-footer": XcastvenXkilianProjectFooter;
        "xcastven-xkilian-project-header": XcastvenXkilianProjectHeader;
        "xcastven-xkilian-project-home-page": XcastvenXkilianProjectHomePage;
        "xcastven-xkilian-project-legend": XcastvenXkilianProjectLegend;
        "xcastven-xkilian-project-login": XcastvenXkilianProjectLogin;
        "xcastven-xkilian-project-menu": XcastvenXkilianProjectMenu;
        "xcastven-xkilian-project-prescription-detail": XcastvenXkilianProjectPrescriptionDetail;
        "xcastven-xkilian-project-prescriptions-list": XcastvenXkilianProjectPrescriptionsList;
        "xcastven-xkilian-project-register": XcastvenXkilianProjectRegister;
        "xcastven-xkilian-project-toast": XcastvenXkilianProjectToast;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "xcastven-xkilian-project-account": LocalJSX.XcastvenXkilianProjectAccount & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectAccountElement>;
            "xcastven-xkilian-project-app": LocalJSX.XcastvenXkilianProjectApp & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectAppElement>;
            "xcastven-xkilian-project-appointment-detail": LocalJSX.XcastvenXkilianProjectAppointmentDetail & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectAppointmentDetailElement>;
            "xcastven-xkilian-project-appointment-scheduler": LocalJSX.XcastvenXkilianProjectAppointmentScheduler & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectAppointmentSchedulerElement>;
            "xcastven-xkilian-project-appointments-list": LocalJSX.XcastvenXkilianProjectAppointmentsList & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectAppointmentsListElement>;
            "xcastven-xkilian-project-calendar": LocalJSX.XcastvenXkilianProjectCalendar & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectCalendarElement>;
            "xcastven-xkilian-project-condition-detail": LocalJSX.XcastvenXkilianProjectConditionDetail & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectConditionDetailElement>;
            "xcastven-xkilian-project-condition-registerer": LocalJSX.XcastvenXkilianProjectConditionRegisterer & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectConditionRegistererElement>;
            "xcastven-xkilian-project-conditions-list": LocalJSX.XcastvenXkilianProjectConditionsList & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectConditionsListElement>;
            "xcastven-xkilian-project-date-picker": LocalJSX.XcastvenXkilianProjectDatePicker & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectDatePickerElement>;
            "xcastven-xkilian-project-drawer": LocalJSX.XcastvenXkilianProjectDrawer & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectDrawerElement>;
            "xcastven-xkilian-project-footer": LocalJSX.XcastvenXkilianProjectFooter & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectFooterElement>;
            "xcastven-xkilian-project-header": LocalJSX.XcastvenXkilianProjectHeader & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectHeaderElement>;
            "xcastven-xkilian-project-home-page": LocalJSX.XcastvenXkilianProjectHomePage & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectHomePageElement>;
            "xcastven-xkilian-project-legend": LocalJSX.XcastvenXkilianProjectLegend & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectLegendElement>;
            "xcastven-xkilian-project-login": LocalJSX.XcastvenXkilianProjectLogin & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectLoginElement>;
            "xcastven-xkilian-project-menu": LocalJSX.XcastvenXkilianProjectMenu & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectMenuElement>;
            "xcastven-xkilian-project-prescription-detail": LocalJSX.XcastvenXkilianProjectPrescriptionDetail & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectPrescriptionDetailElement>;
            "xcastven-xkilian-project-prescriptions-list": LocalJSX.XcastvenXkilianProjectPrescriptionsList & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectPrescriptionsListElement>;
            "xcastven-xkilian-project-register": LocalJSX.XcastvenXkilianProjectRegister & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectRegisterElement>;
            "xcastven-xkilian-project-toast": LocalJSX.XcastvenXkilianProjectToast & JSXBase.HTMLAttributes<HTMLXcastvenXkilianProjectToastElement>;
        }
    }
}

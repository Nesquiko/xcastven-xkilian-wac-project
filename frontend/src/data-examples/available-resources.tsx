import { Equipment, Facility, Medicine } from '../api/generated';

export const AvailableResourcesExample = {
  facilities: [
    { id: "facility-1", name: "Facility 1" },
    { id: "facility-2", name: "Facility 2" },
    { id: "facility-3", name: "Facility 3" },
    { id: "facility-4", name: "Facility 4" },
    { id: "facility-5", name: "Facility 5" },
  ] satisfies Array<Facility>,
  equipment: [
    { id: "equipment-1", name: "Equipment 1" },
    { id: "equipment-2", name: "Equipment 2" },
    { id: "equipment-3", name: "Equipment 3" },
    { id: "equipment-4", name: "Equipment 4" },
    { id: "equipment-5", name: "Equipment 5" },
  ] satisfies Array<Equipment>,
  medicine: [
    { id: "medicine-1", name: "Medicine 1" },
    { id: "medicine-2", name: "Medicine 2" },
    { id: "medicine-3", name: "Medicine 3" },
    { id: "medicine-4", name: "Medicine 4" },
    { id: "medicine-5", name: "Medicine 5" },
  ] satisfies Array<Medicine>,
};

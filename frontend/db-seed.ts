// script generated with LLM for seeding DB
import {
  AppointmentStatus,
  AppointmentType,
  Doctor,
  Patient,
  ResourceType,
  SpecializationEnum,
  UserRole,
} from './src/api/generated';
import { faker } from '@faker-js/faker';
import { MongoClient, Db, Collection, Binary } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://root:mysecret@localhost:27017/xcastven-xkilian-db?authSource=admin';
const DATABASE_NAME = process.env.DATABASE_NAME || 'xcastven-xkilian-db';
const COLLECTION_NAMES = {
  doctors: 'doctors',
  patients: 'patients',
  resources: 'resources',
  conditions: 'conditions',
  appointments: 'appointments',
  prescriptions: 'prescriptions',
  reservations: 'reservations',
};

interface ResourceReference {
  _id: Binary;
  name: string;
  type: ResourceType;
}

interface StoredAppointment {
  _id: Binary;
  patientId: Binary;
  doctorId: Binary;
  appointmentDateTime: Date;
  endTime: Date;
  type: AppointmentType;
  status: AppointmentStatus;
  reason?: string;
  conditionId?: Binary;
  cancellationReason?: string;
  medicines: ResourceReference[];
  facilities: ResourceReference[];
  equipment: ResourceReference[];
}

interface StoredCondition {
  _id: Binary;
  patientId: Binary;
  name: string;
  start: Date;
  end?: Date;
}

interface StoredPrescription {
  _id: Binary;
  patientId: Binary;
  appointmentId?: Binary;
  name: string;
  start: Date;
  end: Date;
  doctorsNote?: string;
}

interface StoredResource {
  _id: Binary;
  name: string;
  type: ResourceType;
}

interface StoredDoctor extends Omit<Doctor, 'id'> {
  _id: Binary;
}

interface StoredPatient extends Omit<Patient, 'id'> {
  _id: Binary;
}

interface StoredReservation {
  _id: Binary;
  appointmentId: Binary;
  resourceId: Binary;
  resourceName: string;
  resourceType: ResourceType;
  startTime: Date;
  endTime: Date;
}

const NUM_DOCTORS = 13;
const NUM_PATIENTS = 100;
const NUM_FACILITIES = 16;
const NUM_EQUIPMENT_TYPES = 41;
const NUM_MEDICINES = 33;
const MAX_APPOINTMENTS_PER_PATIENT = 10;
const MIN_APPOINTMENTS_PER_PATIENT = 1;
const MAX_CONDITIONS_PER_PATIENT = 3;
const MAX_PRESCRIPTIONS_PER_PATIENT = 5;
const now = new Date();
const oneMonthAgo = faker.date.recent({ days: 30, refDate: now });
const twoMonthsAgo = faker.date.recent({ days: 60, refDate: oneMonthAgo });
const threeMonthsAgo = faker.date.recent({ days: 90, refDate: twoMonthsAgo });
const dateRange = { from: threeMonthsAgo, to: now };
const appointmentStatuses = Object.values(AppointmentStatus);
const appointmentTypes = Object.values(AppointmentType);
const doctorSpecializations = Object.values(SpecializationEnum);

function generateUUIDBinary(): Binary {
  return new Binary(Buffer.from(uuidv4().replace(/-/g, ''), 'hex'), Binary.SUBTYPE_UUID);
}

function generateStoredResource(type: ResourceType, name: string): StoredResource {
  return {
    _id: generateUUIDBinary(),
    name: name,
    type: type,
  };
}

function generateDoctor(): StoredDoctor {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    _id: generateUUIDBinary(),
    email: faker.internet.email({ firstName, lastName }),
    firstName: firstName,
    lastName: lastName,
    specialization: faker.helpers.arrayElement(doctorSpecializations),
    role: UserRole.Doctor,
  };
}

function generatePatient(): StoredPatient {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    _id: generateUUIDBinary(),
    email: faker.internet.email({ firstName, lastName }),
    firstName: firstName,
    lastName: lastName,
    role: UserRole.Patient,
  };
}

function generateStoredCondition(patientId: Binary): StoredCondition {
  const start = faker.date.between(dateRange);
  const hasEnd = faker.datatype.boolean(0.7);
  const end = hasEnd ? faker.date.between({ from: start, to: now }) : undefined;
  return {
    _id: generateUUIDBinary(),
    patientId: patientId,
    name: faker.lorem.words(faker.number.int({ min: 2, max: 4 })),
    start: start,
    end: end,
  };
}

function generateStoredPrescription(patientId: Binary, appointmentId?: Binary): StoredPrescription {
  const start = faker.date.between(dateRange);
  const daysToAdd = faker.number.int({ min: 7, max: 90 });
  const endMillis = start.getTime() + daysToAdd * 24 * 60 * 60 * 1000;
  const end = new Date(endMillis);

  return {
    _id: generateUUIDBinary(),
    patientId: patientId,
    appointmentId: appointmentId,
    name: faker.commerce.productName() + ' ' + faker.number.int({ min: 5, max: 500 }) + 'mg',
    start: start,
    end: end,
    doctorsNote: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined,
  };
}

function generateStoredAppointment(
  patientId: Binary,
  doctors: StoredDoctor[],
  patientConditions: StoredCondition[],
  allFacilities: StoredResource[],
  allEquipment: StoredResource[],
  allMedicines: StoredResource[],
  reservationsData: StoredReservation[],
): StoredAppointment {
  const doctor = faker.helpers.arrayElement(doctors);
  const appointmentDateTime = faker.date.between(dateRange);
  const endTime = new Date(
    appointmentDateTime.getTime() + faker.number.int({ min: 15, max: 60 }) * 60000,
  );
  const status = faker.helpers.arrayElement(appointmentStatuses);

  let conditionId: Binary | undefined = undefined;
  if (patientConditions.length > 0 && faker.datatype.boolean(0.9)) {
    conditionId = faker.helpers.arrayElement(patientConditions)._id;
  }

  const appointment: StoredAppointment = {
    _id: generateUUIDBinary(),
    patientId: patientId,
    doctorId: doctor._id,
    appointmentDateTime: appointmentDateTime,
    endTime: endTime,
    type: faker.helpers.arrayElement(appointmentTypes),
    status: status,
    reason: faker.datatype.boolean(0.6) ? faker.lorem.sentence() : undefined,
    conditionId: conditionId,
    cancellationReason:
      status === AppointmentStatus.Cancelled && faker.datatype.boolean(0.8)
        ? faker.lorem.sentence()
        : undefined,
    medicines: [],
    facilities: [],
    equipment: [],
  };

  function createRef(resource: StoredResource): ResourceReference {
    return { _id: resource._id, name: resource.name, type: resource.type };
  }

  if (status === AppointmentStatus.Scheduled || status === AppointmentStatus.Completed) {
    const resourceTypesToConsider: {
      type: ResourceType;
      probability: number;
      data: StoredResource[];
      targetArray: ResourceReference[];
    }[] = [];
    if (allFacilities.length > 0)
      resourceTypesToConsider.push({
        type: ResourceType.Facility,
        probability: 0.2,
        data: allFacilities,
        targetArray: appointment.facilities,
      });
    if (allEquipment.length > 0)
      resourceTypesToConsider.push({
        type: ResourceType.Equipment,
        probability: 0.3,
        data: allEquipment,
        targetArray: appointment.equipment,
      });
    if (allMedicines.length > 0)
      resourceTypesToConsider.push({
        type: ResourceType.Medicine,
        probability: 0.15,
        data: allMedicines,
        targetArray: appointment.medicines,
      });

    // Decide if *any* resource will be reserved (using combined probability, roughly)
    const shouldReserve = faker.datatype.boolean(
      resourceTypesToConsider.reduce((sum, r) => sum + r.probability, 0),
    );

    if (shouldReserve && resourceTypesToConsider.length > 0) {
      // Select *one* resource type based on weighted probability
      const selectedResourceType = faker.helpers.weightedArrayElement(
        resourceTypesToConsider.map(r => ({
          weight: r.probability,
          value: r,
        })),
      );

      if (selectedResourceType && selectedResourceType.data.length > 0) {
        const resourceToReserve = faker.helpers.arrayElement(selectedResourceType.data);

        const reservation: StoredReservation = {
          _id: generateUUIDBinary(),
          appointmentId: appointment._id,
          resourceId: resourceToReserve._id,
          resourceName: resourceToReserve.name,
          resourceType: resourceToReserve.type,
          startTime: appointment.appointmentDateTime,
          endTime: appointment.endTime,
        };
        reservationsData.push(reservation);

        selectedResourceType.targetArray.push(createRef(resourceToReserve));
      }
    }
  }

  return appointment;
}

async function seedDatabase() {
  console.log('Generating fake data using OpenAPI models...');

  const doctorsData: StoredDoctor[] = faker.helpers.multiple(generateDoctor, {
    count: NUM_DOCTORS,
  });
  const patientsData: StoredPatient[] = faker.helpers.multiple(generatePatient, {
    count: NUM_PATIENTS,
  });

  const facilitiesData: StoredResource[] = [];
  const facilityNames = [
    'Consultation Room',
    'Examination Room',
    'X-Ray Room',
    'Ultrasound Suite',
    'MRI Chamber',
    'CT Scanner Room',
    'Minor Procedure Room',
    'Physical Therapy Gym',
    'Lab Sample Collection',
    'Endoscopy Suite',
    'Recovery Bay',
    'Waiting Area Section',
    'Vaccination Station',
    'Audiology Booth',
    'Ophthalmology Exam Lane',
    'Dental Operatory',
  ];
  for (let i = 0; i < NUM_FACILITIES; i++) {
    facilitiesData.push(
      generateStoredResource(
        ResourceType.Facility,
        `${faker.helpers.arrayElement(facilityNames)} ${faker.helpers.arrayElement(['A', 'B', 'C', '1', '2', '3'])}-${faker.number.int({ min: 1, max: 5 })}`,
      ),
    );
  }

  const equipmentData: StoredResource[] = [];
  const equipmentBaseNames = [
    'EKG Machine',
    'Defibrillator',
    'Ventilator',
    'Anesthesia Machine',
    'Patient Monitor',
    'Infusion Pump',
    'Surgical Light',
    'Electrosurgical Unit',
    'Ultrasound Probe',
    'Microscope',
    'Centrifuge',
    'Autoclave',
    'Blood Analyzer',
    'X-Ray Detector Panel',
    'Otoscope',
    'Ophthalmoscope',
    'Sphygmomanometer',
    'Stethoscope',
    'Nebulizer',
    'Oxygen Concentrator',
    'Wheelchair',
    'Hospital Bed',
    'Exam Table',
    'IV Stand',
    'Laryngoscope Set',
    'Scalpel Handle',
    'Forceps Set',
    'Retractor Kit',
    'Suction Machine',
    'Doppler Fetal Monitor',
    'Incubator',
    'Warming Blanket',
    'Pulse Oximeter',
    'Glucometer',
    'Thermometer (Digital)',
    'Cautery Pen',
    'Bone Drill',
    'Endoscope',
    'Colonoscope',
    'Laparoscopic Tower',
    'Cryotherapy Unit',
  ];
  let tempEquipmentNames = [...equipmentBaseNames];
  while (tempEquipmentNames.length < NUM_EQUIPMENT_TYPES) {
    tempEquipmentNames.push(...equipmentBaseNames);
  }
  tempEquipmentNames = tempEquipmentNames.slice(0, NUM_EQUIPMENT_TYPES); // Trim excess

  for (const baseName of tempEquipmentNames) {
    const count = faker.number.int({ min: 1, max: 3 }); // Reduced max count slightly
    for (let j = 0; j < count; j++) {
      equipmentData.push(generateStoredResource(ResourceType.Equipment, `${baseName} #${j + 1}`));
    }
  }

  const medicinesData: StoredResource[] = [];
  const medicinePrefixes = [
    'Liso',
    'Atorva',
    'Metfo',
    'Amlodi',
    'Omepra',
    'Simva',
    'Losar',
    'Azithro',
    'Hydrochlo',
    'Gaba',
    'Ser',
    'Montelu',
    'Rosuva',
    'Escitalo',
    'Trazo',
  ];
  const medicineSuffixes = [
    'pril',
    'statin',
    'min',
    'pine',
    'zole',
    'tan',
    'mycin',
    'thiazide',
    'pentin',
    'traline',
    'kast',
    'pram',
    'done',
    'floxacin',
    'vir',
  ];
  for (let i = 0; i < NUM_MEDICINES; i++) {
    medicinesData.push(
      generateStoredResource(
        ResourceType.Medicine,
        `${faker.helpers.arrayElement(medicinePrefixes)}${faker.helpers.arrayElement(medicineSuffixes)} ${faker.number.int({ min: 5, max: 1000 })}${faker.helpers.arrayElement(['mg', 'mcg', 'IU'])}`,
      ),
    );
  }

  const allResourcesData = [...facilitiesData, ...equipmentData, ...medicinesData];

  const conditionsData: StoredCondition[] = [];
  const prescriptionsData: StoredPrescription[] = [];
  const appointmentsData: StoredAppointment[] = [];
  const reservationsData: StoredReservation[] = [];

  patientsData.forEach(patient => {
    const numConditions = faker.number.int({
      min: 0,
      max: MAX_CONDITIONS_PER_PATIENT,
    });
    const patientConditions: StoredCondition[] = [];
    for (let i = 0; i < numConditions; i++) {
      const condition = generateStoredCondition(patient._id);
      patientConditions.push(condition);
      conditionsData.push(condition);
    }

    const numAppointments = faker.number.int({
      min: MIN_APPOINTMENTS_PER_PATIENT,
      max: MAX_APPOINTMENTS_PER_PATIENT,
    });
    const patientAppointments: StoredAppointment[] = [];
    for (let i = 0; i < numAppointments; i++) {
      const appointment = generateStoredAppointment(
        patient._id,
        doctorsData,
        patientConditions,
        facilitiesData,
        equipmentData,
        medicinesData,
        reservationsData,
      );
      patientAppointments.push(appointment);
      appointmentsData.push(appointment);
    }

    const numPrescriptions = faker.number.int({
      min: 0,
      max: MAX_PRESCRIPTIONS_PER_PATIENT,
    });
    for (let i = 0; i < numPrescriptions; i++) {
      const relevantAppointments = patientAppointments.filter(
        app =>
          app.status === AppointmentStatus.Completed || app.status === AppointmentStatus.Scheduled,
      );
      const linkToAppointment = relevantAppointments.length > 0 && faker.datatype.boolean(0.6);
      const appointmentId = linkToAppointment
        ? faker.helpers.arrayElement(relevantAppointments)._id
        : undefined;

      const prescription = generateStoredPrescription(patient._id, appointmentId);
      prescriptionsData.push(prescription);
    }
  });

  console.log(`Generated ${doctorsData.length} doctors.`);
  console.log(`Generated ${patientsData.length} patients.`);
  console.log(`Generated ${facilitiesData.length} facilities.`);
  console.log(`Generated ${equipmentData.length} equipment items.`);
  console.log(`Generated ${medicinesData.length} medicines.`);
  console.log(`Generated ${allResourcesData.length} total resources.`);
  console.log(`Generated ${conditionsData.length} conditions.`);
  console.log(`Generated ${appointmentsData.length} appointments.`);
  console.log(`Generated ${prescriptionsData.length} prescriptions.`);
  console.log(`Generated ${reservationsData.length} reservations.`);

  const client = new MongoClient(MONGODB_URI);
  let db: Db;

  try {
    await client.connect();
    db = client.db(DATABASE_NAME);
    console.log(`\nConnected successfully to MongoDB server: ${MONGODB_URI}`);
    console.log(`Using database: ${DATABASE_NAME}`);

    console.log('\nInserting data into collections...');

    async function insertData<T extends { _id: Binary }>(collectionName: string, data: T[]) {
      if (data.length === 0) {
        console.log(`Skipping insertion for empty collection: ${collectionName}`);
        return;
      }
      try {
        const collection: Collection<T> = db.collection(collectionName);
        const result = await collection.insertMany(data as any);
        console.log(`Inserted ${result.insertedCount} documents into ${collectionName}`);
      } catch (err) {
        console.error(`Error inserting into ${collectionName}:`, err);
      }
    }

    await insertData(COLLECTION_NAMES.doctors, doctorsData);
    await insertData(COLLECTION_NAMES.patients, patientsData);
    await insertData(COLLECTION_NAMES.resources, allResourcesData);
    await insertData(COLLECTION_NAMES.conditions, conditionsData);
    await insertData(COLLECTION_NAMES.appointments, appointmentsData);
    await insertData(COLLECTION_NAMES.prescriptions, prescriptionsData);
    await insertData(COLLECTION_NAMES.reservations, reservationsData);

    console.log('\nData insertion complete.');
  } catch (err) {
    console.error('Error during database operation:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

seedDatabase().catch(console.error);

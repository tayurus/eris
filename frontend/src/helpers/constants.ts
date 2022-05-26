import { ResourceLabel } from "src/types/ResourceLabel";

export const AppointmentMap: Record<ResourceLabel, string> = {
  AllergyIntolerance: "light-pink",
  Appointment: "blue",
  Procedure: "brown-light",
  Observation: "light-blue",
  MedicationStatement: "green",
  Immunization: "brown",
  Condition: "light-green",
  CarePlan: "pink",
};

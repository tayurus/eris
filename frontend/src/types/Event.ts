import { ResourceLabel } from "src/types/ResourceLabel";

export type Event = {
  id: string;
  appointmentId: string;
  name: string;
  resource: ResourceLabel;
  date: string;
};

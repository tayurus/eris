import { API } from "src/helpers/api";

export const fetchEvents = async () => {
  const events = await API.post("events");
  console.log("events", events);
  return events;
};

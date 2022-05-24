import { API } from "src/helpers/api";
import {Event} from "src/types/Event";

export const fetchEvents = async () => {
  const response: {items: Event[]} = await API.post("events");
  return response.items;
};

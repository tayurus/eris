import { SortedDataItem } from "src/types/SortedDataItem";

export function sortEvents(event1: SortedDataItem, event2: SortedDataItem) {
  return +new Date(event2.date) - +new Date(event1.date);
}

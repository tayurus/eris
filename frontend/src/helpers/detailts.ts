import { SortedDataItem } from "src/types/SortedDataItem";

export function renderDetails(event: SortedDataItem) {
  if (event.details) {
    if (Array.isArray(event.values) && event.values.length) {
      return `${event.details}: ${event.values
        .map((it) => {
          if (typeof it === "object") {
            return `${it.value} ${it.unit}`;
          }
          return it;
        })
        .join(",")}`;
    }
    return event.details;
  }

  return "";
}

import { API } from "src/helpers/api";
import { Resource } from "src/types/Resource";

export const fetchResources = async (ids: string[]) => {
  const response: { items: Resource[] } = await API.post("resources", { ids });
  return response.items;
};

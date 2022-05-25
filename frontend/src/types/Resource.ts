export type Resource = {
  id: string;
  details: string;
  values: Array<string | { value: string; unit: string }>;
  code: string;
};

import zod from "zod";

export const TemperatureUnitName = {
  c: 'c',
  f: 'f',
} as const;
export type TemperatureUnit = keyof typeof TemperatureUnitName;

export const unitSchema = zod.enum(TemperatureUnitName).default('c');


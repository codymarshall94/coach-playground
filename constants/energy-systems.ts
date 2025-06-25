export interface EnergySystem {
  id: EnergySystemType;
  name: EnergySystemType;
}

export type EnergySystemType = "ATP-CP" | "Glycolytic" | "Oxidative";

export const ENERGY_SYSTEMS: EnergySystem[] = [
  {
    id: "ATP-CP",
    name: "ATP-CP",
  },
  {
    id: "Glycolytic",
    name: "Glycolytic",
  },
  {
    id: "Oxidative",
    name: "Oxidative",
  },
];

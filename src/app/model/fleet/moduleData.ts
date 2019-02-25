import { IModuleData, ALL_SIZES } from "./module";

export const ModulesData: IModuleData[] = [
  {
    id: "l",
    name: "Laser",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 50,
    armorPercent: 200
  },
  {
    id: "m",
    name: "Mining Laser",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 20,
    armorPercent: 300
  },
  {
    id: "p",
    name: "Plasma",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 5,
    armorPercent: 400
  },
  {
    id: "d",
    name: "Mass Driver",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 200,
    armorPercent: 50
  },
  {
    id: "r",
    name: "Railgun",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 300,
    armorPercent: 20
  },
  {
    id: "g",
    name: "Gauss rifle",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 400,
    armorPercent: 5
  },
  {
    id: "S",
    name: "Solar Panel",
    sizes: ALL_SIZES,
    energyBalance: 4,
    alloyPrice: 10
  },
  {
    id: "R",
    name: "RTG",
    sizes: ALL_SIZES,
    energyBalance: 8,
    alloyPrice: 20
  },
  {
    id: "F",
    name: "Fusion Reactor",
    sizes: ALL_SIZES,
    energyBalance: 16,
    alloyPrice: 30
  },
  {
    id: "a",
    name: "Armor",
    sizes: ALL_SIZES,
    energyBalance: 0,
    alloyPrice: 10,
    armor: 20
  },
  {
    id: "s",
    name: "Shield",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 20,
    shield: 20
  }
];

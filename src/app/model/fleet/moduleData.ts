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
    armorPercent: 200,
    nextToUnlock: ["p"],
    researchPrice: 100,
    shape: "laser"
  },
  {
    id: "p",
    name: "Plasma",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 5,
    armorPercent: 400,
    researchPrice: 100,
    shape: "plasma"
  },
  {
    id: "d",
    name: "Mass Driver",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 200,
    armorPercent: 50,
    nextToUnlock: ["g"],
    researchPrice: 100
  },
  {
    id: "g",
    name: "Gauss rifle",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 400,
    armorPercent: 5,
    researchPrice: 100
  },
  {
    id: "S",
    name: "Solar Panel",
    sizes: ALL_SIZES,
    energyBalance: 2,
    alloyPrice: 10,
    nextToUnlock: ["R"],
    researchPrice: 100,
    shape: "solar"
  },
  {
    id: "R",
    name: "RTG",
    sizes: ALL_SIZES,
    energyBalance: 4,
    alloyPrice: 20,
    nextToUnlock: ["F"],
    researchPrice: 100,
    shape: "radioactive"
  },
  {
    id: "F",
    name: "Fusion Reactor",
    sizes: ALL_SIZES,
    energyBalance: 6,
    alloyPrice: 30,
    researchPrice: 100,
    shape: "reactor"
  },
  {
    id: "a",
    name: "Armor",
    sizes: ALL_SIZES,
    energyBalance: 0,
    alloyPrice: 10,
    armor: 20,
    researchPrice: 100,
    shape: "armor"
  },
  {
    id: "s",
    name: "Shield",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 20,
    shield: 20,
    researchPrice: 100,
    shape: "shield"
  }
];

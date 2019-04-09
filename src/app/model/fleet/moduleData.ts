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
    researchPrice: 2e3,
    shape: "laser",
    start: true
  },
  {
    id: "p",
    name: "Plasma",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 20,
    armorPercent: 400,
    researchPrice: 2e3,
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
    researchPrice: 2e3
  },
  {
    id: "g",
    name: "Gauss rifle",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 400,
    armorPercent: 20,
    researchPrice: 2e3
  },
  {
    id: "S",
    name: "Solar Panel",
    sizes: ALL_SIZES,
    energyBalance: 2,
    alloyPrice: 10,
    nextToUnlock: ["R"],
    researchPrice: 2e3,
    shape: "solar",
    start: true
  },
  {
    id: "R",
    name: "RTG",
    sizes: ALL_SIZES,
    energyBalance: 4,
    alloyPrice: 20,
    nextToUnlock: ["F"],
    researchPrice: 2e3,
    shape: "radioactive",
    explosionChance: 10
  },
  {
    id: "F",
    name: "Fusion Reactor",
    sizes: ALL_SIZES,
    energyBalance: 6,
    alloyPrice: 30,
    researchPrice: 2e3,
    shape: "reactor",
    explosionChance: 20
  },
  {
    id: "a",
    name: "Armor",
    sizes: ALL_SIZES,
    energyBalance: 0,
    alloyPrice: 10,
    armor: 20,
    researchPrice: 2e3,
    shape: "armor",
    start: true
  },
  {
    id: "s",
    name: "Shield",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 20,
    shield: 20,
    researchPrice: 2e3,
    shape: "shield"
  }
];

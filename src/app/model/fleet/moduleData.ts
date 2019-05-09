import { IModuleData, ALL_SIZES } from "./module";
export const BASE_ARMOR = 30;

export const ModulesData: IModuleData[] = [
  {
    id: "l",
    name: "Laser",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 75,
    armorPercent: 125,
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
    shieldPercent: 30,
    armorPercent: 170,
    researchPrice: 2e3,
    nextToUnlock: ["i"],
    shape: "plasma"
  },
  {
    id: "i",
    name: "Disintegrator",
    sizes: ALL_SIZES,
    energyBalance: -2,
    alloyPrice: 100,
    damage: 10,
    shieldPercent: 0,
    armorPercent: 220,
    researchPrice: 2e3,
    shape: "disintegrator"
  },
  {
    id: "d",
    name: "Mass Driver",
    sizes: ALL_SIZES,
    energyBalance: -1,
    alloyPrice: 10,
    damage: 10,
    shieldPercent: 125,
    armorPercent: 75,
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
    shieldPercent: 170,
    armorPercent: 30,
    nextToUnlock: ["e"],
    researchPrice: 2e3
  },
  {
    id: "e",
    name: "Rail gun",
    sizes: ALL_SIZES,
    energyBalance: -2,
    alloyPrice: 100,
    damage: 10,
    shieldPercent: 220,
    armorPercent: 0,
    researchPrice: 2e3,
    shape: "railgun"
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
    explosionChance: 15
  },
  {
    id: "F",
    name: "Fusion Reactor",
    sizes: ALL_SIZES,
    energyBalance: 6,
    alloyPrice: 30,
    researchPrice: 2e3,
    shape: "reactor",
    explosionChance: 25
  },
  {
    id: "a",
    name: "Armor",
    sizes: ALL_SIZES,
    energyBalance: 0,
    alloyPrice: 10,
    armor: BASE_ARMOR,
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
    shield: BASE_ARMOR,
    researchPrice: 2e3,
    shape: "shield"
  }
];

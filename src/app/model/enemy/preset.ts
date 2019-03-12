import { ShipTypes, ShipType } from "../fleet/shipTypes";
import { Sizes } from "../fleet/module";

export class Preset {
  name: string;
  type: ShipType;
  modules: Array<{ quantity: number; id: string[]; size: Sizes }>;
}
const RANDOM_WEAPON = ["l", "p", "d", "g"];
const RANDOM_DEFENSE = ["a", "s"];
const RANDOM_GENERATOR = ["S", "R", "F"];

export const Presets: Preset[] = [
  {
    name: "Corvette",
    type: ShipTypes[0],
    modules: [
      {
        quantity: 1,
        id: RANDOM_WEAPON,
        size: Sizes.Small
      },
      {
        quantity: 1,
        id: RANDOM_GENERATOR,
        size: Sizes.Small
      },
      {
        quantity: 1,
        id: RANDOM_DEFENSE,
        size: Sizes.Small
      }
    ]
  },
  {
    name: "Frigate",
    type: ShipTypes[1],
    modules: [
      {
        quantity: 1,
        id: RANDOM_WEAPON,
        size: Sizes.Small
      },
      {
        quantity: 1,
        id: RANDOM_GENERATOR,
        size: Sizes.Small
      },
      {
        quantity: 1,
        id: ["a"],
        size: Sizes.Small
      },
      {
        quantity: 1,
        id: RANDOM_DEFENSE,
        size: Sizes.Small
      }
    ]
  }
];

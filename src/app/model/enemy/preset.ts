import { ShipTypes, ShipType } from "../fleet/shipTypes";
import { Sizes } from "../fleet/module";

export class Preset {
  name: string;
  type: ShipType;
  modules: Array<{ quantity: number; id: string; size: Sizes }>;
}

export const Presets: Preset[] = [
  {
    name: "Corvette",
    type: ShipTypes[0],
    modules: [
      {
        quantity: 1,
        id: "l",
        size: Sizes.Small
      },
      {
        quantity: 1,
        id: "S",
        size: Sizes.Small
      },
      {
        quantity: 1,
        id: "a",
        size: Sizes.Small
      },
      {
        quantity: 1,
        id: "s",
        size: Sizes.Small
      }
    ]
  }
];

import { ShipType } from "./shipTypes";
import { Weapon } from "./weapon";

export class ShipDesign {
  id: string;
  type: ShipType;
  name = "";
  weapons = new Array<Weapon>();
}

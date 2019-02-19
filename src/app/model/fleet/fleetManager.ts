import { ISalvable } from "../base/ISalvable";
import { ShipDesign } from "./shipDesign";

export class FleetManages implements ISalvable {
  totalNavalCapacity = new Decimal(20);
  ships = new Array<[Decimal, ShipDesign]>();

  getSave() {}
  load(data: any): boolean {
    return true;
  }
}

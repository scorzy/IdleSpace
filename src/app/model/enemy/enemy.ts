import { ISalvable } from "../base/ISalvable";
import { Zone } from "./zone";
import { ShipDesign } from "../fleet/shipDesign";

export class Enemy implements ISalvable {
  name = "";
  level = 0;
  zones = new Array<Zone>();
  shipDesign = new Array<ShipDesign>();

  static generate(fleetPowerMulti: Decimal): Enemy {
    const enemy = new Enemy();

    return enemy;
  }

  getSave() {
    throw new Error("Method not implemented.");
  }
  load(data: any): boolean {
    throw new Error("Method not implemented.");
  }
}

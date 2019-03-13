import { ISalvable } from "../base/ISalvable";
import { Zone } from "./zone";
import { ShipDesign } from "../fleet/shipDesign";

export class Enemy implements ISalvable {
  name = "";
  level = 0;
  zones = new Array<Zone>();
  shipDesign = new Array<ShipDesign>();

  static generate(level: number): Enemy {
    const enemy = new Enemy();
    enemy.level = level;

    return enemy;
  }

  getSave() {
    throw new Error("Method not implemented.");
  }
  load(data: any): boolean {
    throw new Error("Method not implemented.");
  }
}

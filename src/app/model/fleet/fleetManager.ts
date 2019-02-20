import { ISalvable } from "../base/ISalvable";
import { ShipDesign } from "./shipDesign";
import { ShipType } from "./shipTypes";

export class FleetManager implements ISalvable {
  totalNavalCapacity = new Decimal(20);
  ships = new Array<ShipDesign>();

  addDesign(name: string, type: ShipType): ShipDesign {
    const design = new ShipDesign();

    design.id =
      "" +
      this.ships
        .map(s => parseInt(s.id, 10))
        .reduce((p, c) => Math.max(p, c), 0) +
      1;
    design.name = name;
    design.type = type;

    this.ships.push(design);
    return design;
  }

  getSave() {}
  load(data: any): boolean {
    return true;
  }
}

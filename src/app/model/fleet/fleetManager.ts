import { ISalvable } from "../base/ISalvable";
import { ShipDesign } from "./shipDesign";
import { ShipType } from "./shipTypes";
import { Module } from "./module";
import { ModulesData } from "./moduleData";

export class FleetManager implements ISalvable {
  totalNavalCapacity = new Decimal(20);
  ships = new Array<ShipDesign>();

  allModules = new Array<Module>();
  unlockedModules = new Array<Module>();

  constructor() {
    for (const data of ModulesData) this.allModules.push(Module.fromData(data));

    this.allModules.forEach(w => (w.unlocked = true));
    this.reload();
  }

  reload() {
    this.unlockedModules = this.allModules.filter(w => w.unlocked);
  }
  addDesign(name: string, type: ShipType): ShipDesign {
    const design = new ShipDesign();

    design.id =
      "" +
      (this.ships
        .map(s => parseInt(s.id, 10))
        .reduce((p, c) => Math.max(p, c), 0) +
        1);
    design.name = name;
    design.type = type;

    design.reload();
    this.ships.push(design);
    return design;
  }
  deleteDesign(ds: ShipDesign) {
    this.ships = this.ships.filter(d => d !== ds);
  }
  getSave() {}
  load(data: any): boolean {
    this.reload();
    return true;
  }
}

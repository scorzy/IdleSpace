import { ISalvable } from "../base/ISalvable";
import { ShipDesign } from "./shipDesign";
import { ShipType } from "./shipTypes";
import { Module } from "./module";
import { ModulesData } from "./moduleData";
import { Research } from "../research/research";
import { Resource } from "../resource/resource";

export class FleetManager implements ISalvable {
  private static instance: FleetManager;

  totalNavalCapacity = new Decimal(20);
  ships = new Array<ShipDesign>();
  freeNavalCapacity: Resource;

  allModules = new Array<Module>();
  unlockedModules = new Array<Module>();

  constructor() {
    FleetManager.instance = this;
    this.freeNavalCapacity = new Resource("N");
    for (const data of ModulesData) this.allModules.push(Module.fromData(data));

    // const mLaserRes = new Research("m");

    this.allModules.forEach(w => (w.unlocked = true));
    this.reload();
  }
  static getInstance(): FleetManager {
    return FleetManager.instance;
  }

  reload() {
    this.allModules.forEach(m => m.reload());
    this.unlockedModules = this.allModules.filter(w => w.unlocked);
  }
  reloadActions() {
    this.reloadNavalCapacity();
    this.ships.forEach(s => {
      s.buyAction.reload();
    });
  }
  reloadNavalCapacity() {
    this.freeNavalCapacity.quantity = this.totalNavalCapacity.minus(
      this.ships
        .map(s => s.quantity.times(s.type.navalCapacity))
        .reduce((p, c) => p.plus(c), new Decimal(0))
    );
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
  getSave() {
    const data: any = {};
    data.s = this.ships.map(s => s.getSave());
    return data;
  }
  load(data: any): boolean {
    if ("s" in data) {
      for (const shipData of data.s) {
        const ship = new ShipDesign();
        ship.load(shipData);
        this.ships.push(ship);
      }
    }
    this.reload();
    this.reloadNavalCapacity();
    return true;
  }
}

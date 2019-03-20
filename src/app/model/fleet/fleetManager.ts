import { ISalvable } from "../base/ISalvable";
import { ShipDesign } from "./shipDesign";
import { ShipType } from "./shipTypes";
import { Module } from "./module";
import { ModulesData } from "./moduleData";
import { Resource } from "../resource/resource";
import { Shipyard } from "../shipyard/shipyard";

export const MAX_NAVAL_CAPACITY = 1e4;

export class FleetManager implements ISalvable {
  private static instance: FleetManager;

  totalNavalCapacity = new Decimal(20);
  ships = new Array<ShipDesign>();
  freeNavalCapacity: Resource;
  usedNavalCapacity = new Decimal(0);
  totalShips = new Decimal(0);

  allModules = new Array<Module>();
  unlockedModules = new Array<Module>();
  armor: Module;

  constructor() {
    FleetManager.instance = this;
    this.freeNavalCapacity = new Resource("N");
    for (const data of ModulesData) this.allModules.push(Module.fromData(data));
    this.armor = this.allModules.find(m => m.id === "a");
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
    this.totalShips = this.ships
      .map(s => s.quantity)
      .reduce((p, c) => p.plus(c), new Decimal(0));

    this.usedNavalCapacity = ShipDesign.GetTotalNavalCap(this.ships).plus(
      Shipyard.getInstance().getTotalNavalCapacity()
    );
    this.freeNavalCapacity.quantity = this.totalNavalCapacity.minus(
      this.usedNavalCapacity
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
  reorderModules() {
    this.unlockedModules.sort(
      (a, b) =>
        ModulesData.findIndex(q => q.id === a.id) -
        ModulesData.findIndex(h => h.id === b.id)
    );
  }
  upgradingCheck() {
    this.ships.forEach(s => {
      s.isUpgrading = Shipyard.getInstance().isUpgrading(s);
    });
  }
}

import { ISalvable } from "../base/ISalvable";
import { Zone } from "./zone";
import { ShipDesign, SIZE_MULTI } from "../fleet/shipDesign";
import { MAX_NAVAL_CAPACITY } from "../fleet/fleetManager";
import { ShipTypes } from "../fleet/shipTypes";
import { Presets, Preset } from "./preset";
import sample from "lodash-es/sample";
import random from "lodash-es/random";

export class Enemy {
  constructor() {
    Enemy.lastId++;
    this.id = Enemy.lastId;
  }
  private static lastId = 0;

  name = "";
  level = 0;
  zones = new Array<Zone>();
  shipsDesign = new Array<ShipDesign>();
  totalFleetPower = new Decimal(0);
  id = 0;
  shape = "flask";
  currentZone: Zone;
  totalNavalCap = new Decimal(0);

  static generate(level: number): Enemy {
    const enemy = new Enemy();
    enemy.level = level;
    enemy.name = "Enemy " + enemy.id;
    const moduleLevelMulti = random(1, 5);
    const moduleLevel = level * moduleLevelMulti;
    // moduleLevelMulti = moduleLevelMulti * (1 + SIZE_MULTI);
    const navalCap =
      (MAX_NAVAL_CAPACITY * level) / (level + 20) / moduleLevelMulti;
    const maxShipTye = Math.min(level, ShipTypes.length);
    for (let i = 0; i < maxShipTye; i++) {
      if (!(maxShipTye > 2 && Math.random() < 0.15)) {
        let presets = Presets.filter(p => p.type === ShipTypes[i]);
        const pres = sample(presets);
        enemy.addFromPreset(pres);
        if (presets.length > 2 && Math.random() < 0.3) {
          presets = presets.filter(p => p !== pres);
          const pres2 = sample(presets);
          enemy.addFromPreset(pres2);
        }
      }
    }
    const totalWeight = enemy.shipsDesign
      .map(s => s.weight)
      .reduce((p, c) => p + c, 0);
    enemy.shipsDesign.forEach(sd => {
      const numOfShips = Math.floor(
        (navalCap * sd.weight) / totalWeight / sd.type.navalCapacity
      );
      sd.quantity = new Decimal(numOfShips);
      sd.modules.forEach(m => {
        m.level = moduleLevel;
      });
      sd.reload(false);
    });
    enemy.reload();
    return enemy;
  }
  static fromData(data: any): Enemy {
    const enemy = new Enemy();
    if ("n" in data) enemy.name = data.n;
    if ("l" in data) enemy.level = data.l;
    if ("s" in data) {
      for (const shipData of data.s) {
        const ship = new ShipDesign();
        ship.load(shipData);
        enemy.shipsDesign.push(ship);
      }
    }
    if ("z" in data) {
      enemy.generateZones(true);
      for (let i = 0; i++; i < data.z.length) {
        enemy.zones[i].load(data.z[i]);
      }
    }
    enemy.reload();
    return enemy;
  }

  reload() {
    this.totalNavalCap = new Decimal(0);
    this.totalFleetPower = new Decimal(0);
    this.shipsDesign.forEach(sd => {
      this.totalFleetPower = this.totalFleetPower.plus(
        sd.totalFleetPower.times(sd.quantity)
      );
    });
    this.totalNavalCap = ShipDesign.GetTotalNavalCap(this.shipsDesign);
    this.zones.forEach(z => {
      z.enemy = this;
    });
  }
  generateZones(empty = false) {
    for (let i = 0; i < 100; i++) {
      const zone = new Zone();
      zone.number = i;
      this.zones.push(zone);
    }
    this.currentZone = this.zones[0];
    this.zones.forEach(z => {
      z.enemy = this;
    });
  }
  private addFromPreset(pres: Preset) {
    const design = ShipDesign.fromPreset(pres);
    design.weight = random(1, 5);
    design.id = this.id + "-" + this.shipsDesign.length;
    this.shipsDesign.push(design);
  }
  getSave() {
    const data: any = {};
    data.n = this.name;
    data.l = this.level;
    data.s = this.shipsDesign.map(s => s.getSave());
    if (this.zones.length > 0) data.z = this.zones.map(z => z.getSave());

    return data;
  }
}

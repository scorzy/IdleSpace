import { ISalvable } from "../base/ISalvable";
import { Zone } from "./zone";
import { ShipDesign } from "../fleet/shipDesign";
import { MAX_NAVAL_CAPACITY } from "../fleet/fleetManager";
import { ShipTypes } from "../fleet/shipTypes";
import { Presets, Preset } from "./preset";
import sample from "lodash-es/sample";
import random from "lodash-es/random";

export class Enemy implements ISalvable {
  name = "";
  level = 0;
  zones = new Array<Zone>();
  shipDesign = new Array<ShipDesign>();
  totalFleetPower = new Decimal(0);

  constructor(level: number) {
    this.level = level;
    const moduleLevelMulti = random(1, 5);
    const moduleLevel = level * moduleLevelMulti;
    const navalCap =
      (MAX_NAVAL_CAPACITY * level) / (level + 20) / moduleLevelMulti;
    const maxShipTye = Math.min(level, ShipTypes.length);
    for (let i = 0; i < maxShipTye; i++) {
      if (!(maxShipTye > 2 && Math.random() < 0.15)) {
        let presets = Presets.filter(p => p.type === ShipTypes[i]);
        const pres = sample(presets);
        this.addFromPreset(pres);
        if (Math.random() < 0.3) {
          presets = presets.filter(p => p !== pres);
          const pres2 = sample(presets);
          this.addFromPreset(pres2);
        }
      }
    }
    const totalWeight = this.shipDesign
      .map(s => s.weight)
      .reduce((p, c) => p + c, 0);
    this.shipDesign.forEach(sd => {
      const numOfShips = Math.ceil(
        (navalCap * sd.weight) / totalWeight / sd.type.navalCapacity
      );
      sd.quantity = new Decimal(numOfShips);
      sd.modules.forEach(m => {
        m.level = moduleLevel;
      });
      sd.reload(false);
      this.totalFleetPower = this.totalFleetPower.plus(sd.totalFleetPower);
    });
  }

  private addFromPreset(pres: Preset) {
    const design = ShipDesign.fromPreset(pres);
    design.weight = random(1, 5);
    this.shipDesign.push(design);
  }

  getSave() {
    throw new Error("Method not implemented.");
  }
  load(data: any): boolean {
    throw new Error("Method not implemented.");
  }
}

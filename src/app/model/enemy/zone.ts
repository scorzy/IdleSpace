import { ShipDesign } from "../fleet/shipDesign";
import { ISalvable } from "../base/ISalvable";
import { Enemy } from "./enemy";
import { Reward } from "./reward";
import { ResourceManager } from "../resource/resourceManager";
import { MyFromDecimal } from "../utility/myUtility";

const TO_DO_COLOR = [245, 79, 71];
const DONE_COLOR = [96, 181, 21];
const MAX_ZONE_QUANTITY_MULTI = 2;

export class Zone implements ISalvable {
  completed = false;
  percentCompleted = 0;
  number = 0;
  reward: Reward;
  ships = new Array<ShipDesign>();
  enemy: Enemy;
  color = "rgb(245, 79, 71)";
  originalNavCap = new Decimal(0);
  shape: string;
  mergedOrigin: Zone = null;

  generateShips(design: ShipDesign[]) {
    const multi = 1 + ((MAX_ZONE_QUANTITY_MULTI - 1) * (this.number + 1)) / 100;
    this.ships = new Array<ShipDesign>();
    design.forEach(d => {
      const newDesign = d.getCopy();
      newDesign.id = newDesign.id + "#" + this.number;
      newDesign.quantity = d.quantity.times(multi).floor();
      this.ships.push(newDesign);
    });
    this.originalNavCap = ShipDesign.GetTotalNavalCap(this.ships);
  }
  reload() {
    if (this.completed) {
      this.color = "rgb(96, 181, 21)";
    } else {
      if (this.mergedOrigin && this.ships.length === 0) {
        this.color = this.mergedOrigin.color;
      } else {
        if (this.ships && this.ships.length > 0) {
          this.ships.forEach(s => s.reload(false));
          const totalNav = ShipDesign.GetTotalNavalCap(this.ships);
          this.percentCompleted =
            1 - totalNav.div(this.originalNavCap).toNumber();
          this.color = "rgb(";
          for (let i = 0; i < 3; i++) {
            const col =
              TO_DO_COLOR[i] +
              (DONE_COLOR[i] - TO_DO_COLOR[i]) * this.percentCompleted;
            this.color += col + (i < 2 ? "," : "");
          }
          this.color += ")";

          let n = 1;
          this.ships.forEach(s => {
            s.order = n;
            n++;
          });
        }
      }
    }

    this.setShape();
  }
  getSave() {
    const data: any = {};
    data.c = this.completed;
    data.r = this.reward;
    if (this.ships && this.ships.length > 0) {
      data.s = this.ships.map(s => s.getSave());
    }
    if (this.originalNavCap && this.originalNavCap.gt(0)) {
      data.n = this.originalNavCap;
    }
    if (this.reward) data.w = this.reward;
    return data;
  }
  load(data: any): boolean {
    if ("c" in data) this.completed = data.c;
    if ("r" in data) this.reward = data.r;
    if ("ship" in data) {
      for (const shipData of data.s) {
        const ship = new ShipDesign();
        ship.load(shipData, false);
        this.ships.push(ship);
      }
    }
    if ("n" in data) this.originalNavCap = MyFromDecimal(data.n);
    if ("w" in data) this.reward = data.w;
    this.reload();
    return true;
  }

  setShape() {
    if (!this.reward) return false;
    switch (this.reward) {
      case Reward.HabitableSpace:
        this.shape = "world";
        break;
      case Reward.MetalMine:
        this.shape = ResourceManager.getInstance().metal.shape;
        break;
      case Reward.CrystalMine:
        this.shape = ResourceManager.getInstance().crystal.shape;
        break;
      case Reward.Robot:
        this.shape = ResourceManager.getInstance().drone.shape;
        break;
    }
  }
}

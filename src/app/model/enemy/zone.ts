import { ShipDesign } from "../fleet/shipDesign";
import { ISalvable } from "../base/ISalvable";
import { Enemy } from "./enemy";

const TO_DO_COLOR = [245, 79, 71];
const DONE_COLOR = [96, 181, 21];

export class Zone implements ISalvable {
  completed = false;
  percentCompleted = 0;
  number = 0;
  reward: number;
  ships = new Array<ShipDesign>();
  enemy: Enemy;
  color = "rgb(245, 79, 71)";

  reload() {
    const totalNav = ShipDesign.GetTotalNavalCap(this.ships);
    const originalNavCap = this.enemy.totalNavalCap;
    this.percentCompleted =
      1 - Math.floor(totalNav.div(originalNavCap).toNumber());
    this.color = "rgb(";
    for (let i = 0; i < 3; i++) {
      const col =
        TO_DO_COLOR[i] +
        (DONE_COLOR[i] - TO_DO_COLOR[i]) * this.percentCompleted;
      this.color += col + (i < 2 ? "," : "");
    }
    this.color += ")";
  }
  getSave() {
    const data: any = {};
    data.c = this.completed;
    data.r = this.reward;
    if (this.ships.length > 0) data.s = this.ships.map(s => s.getSave());
    return data;
  }
  load(data: any): boolean {
    if ("c" in data) this.completed = data.c;
    if ("r" in data) this.reward = data.r;
    if ("ship" in data) {
      for (const shipData of data.s) {
        const ship = new ShipDesign();
        ship.load(shipData);
        this.ships.push(ship);
      }
    }
    this.reload();
    return true;
  }
}

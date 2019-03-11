import { Enemy } from "./enemy";
import { ISalvable } from "../base/ISalvable";

export class EnemyManager implements ISalvable {
  currentEnemy: Enemy;
  allEnemy = new Array<Enemy>();

  getSave() {
    throw new Error("Method not implemented.");
  }
  load(data: any): boolean {
    throw new Error("Method not implemented.");
  }
}

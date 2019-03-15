import { Enemy } from "./enemy";
import { ISalvable } from "../base/ISalvable";

export class EnemyManager implements ISalvable {
  currentEnemy: Enemy;
  allEnemy = new Array<Enemy>();
  chosenEnemy = new Array<Enemy>();
  maxLevel = 1;

  generate() {
    this.allEnemy.push(Enemy.generate(1));
  }
  attack(enemy: Enemy) {
    if (this.currentEnemy) return false;
    this.currentEnemy = enemy;
    this.allEnemy = this.allEnemy.filter(e => e !== enemy);
    this.currentEnemy.generateZones();
  }

  getSave(): any {
    const data: any = {};
    if (this.maxLevel > 1) data.l = this.maxLevel;
    if (!!this.currentEnemy) data.c = this.currentEnemy.getSave();
    if (this.allEnemy.length > 0) data.a = this.allEnemy.map(e => e.getSave());
    if (this.chosenEnemy.length > 0) {
      data.o = this.chosenEnemy.map(e => e.getSave());
    }

    return data;
  }
  load(data: any): boolean {
    if ("l" in data) this.maxLevel = data.l;
    if ("c" in data) this.currentEnemy = Enemy.fromData(data.c);
    if ("a" in data) {
      for (const enemyData of data.a) {
        this.allEnemy.push(Enemy.fromData(enemyData));
      }
    }
    if ("o" in data) {
      for (const enemyData of data.o) {
        this.chosenEnemy.push(Enemy.fromData(enemyData));
      }
    }

    return true;
  }
}

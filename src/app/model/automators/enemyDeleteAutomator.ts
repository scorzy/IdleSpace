import { Automator } from "./automator";
import { EnemyManager, MAX_ENEMY_LIST_SIZE } from "../enemy/enemyManager";

export class EnemyDeleteAutomator extends Automator {
  constructor() {
    super("DEM");
    this.name = "Auto Delete Enemy";
    this.description = "Automatically delete enemy of lower level when full.";
    this.prestigeLevel = 3;
    this.showResourceUsage = false;
  }
  execCondition(): boolean {
    const em = EnemyManager.getInstance();
    return em.allEnemy.length >= MAX_ENEMY_LIST_SIZE;
  }
  doAction(): boolean {
    const em = EnemyManager.getInstance();
    let toRemove = em.allEnemy[0];
    em.allEnemy.forEach(e => {
      if (e.level < toRemove.level) {
        toRemove = e;
      }
    });
    em.allEnemy = em.allEnemy.filter(e => e !== toRemove);
    return true;
  }
}

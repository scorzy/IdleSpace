import { Automator } from "./automator";
import { EnemyManager, MAX_ENEMY_LIST_SIZE } from "../enemy/enemyManager";

export class SearchAutomator extends Automator {
  constructor() {
    super("EAM");
    this.name = "Auto Enemy Search";
    this.description = "Automatically search enemy of max level.";
    this.prestigeLevel = 3;
    this.showResourceUsage = false;
  }
  execCondition(): boolean {
    const em = EnemyManager.getInstance();
    return (
      em.searchJobs.length === 0 && em.allEnemy.length < MAX_ENEMY_LIST_SIZE
    );
  }
  doAction(): boolean {
    const em = EnemyManager.getInstance();
    em.startSearching(em.maxLevel);
    return true;
  }
}

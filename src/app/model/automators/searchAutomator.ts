import { Automator } from "./automator";
import { EnemyManager, MAX_ENEMY_LIST_SIZE } from "../enemy/enemyManager";

export class SearchAutomator extends Automator {
  maxLevel = true;
  userLevel = 1;
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
    em.startSearching(
      this.maxLevel ? em.maxLevel : Math.min(em.maxLevel, this.userLevel)
    );
    return true;
  }
  getSave(): any {
    const data = super.getSave();
    data.ml = this.maxLevel;
    data.ul = this.userLevel;
    return data;
  }
  load(data: any) {
    if (!super.load(data)) return false;
    if ("ml" in data) this.maxLevel = data.ml;
    if ("ul" in data) this.userLevel = data.ul;
    return true;
  }
}

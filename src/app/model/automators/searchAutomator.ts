import { Automator } from "./automator";
import { EnemyManager, MAX_ENEMY_LIST_SIZE } from "../enemy/enemyManager";
import { ResourceManager } from "../resource/resourceManager";

export class SearchAutomator extends Automator {
  maxLevel = true;
  userLevel = 1;
  afterEnemyDefeat = false;
  enemyDefeated = false;

  constructor() {
    super("EAM");
    this.name = "Auto Enemy Search";
    this.description = "Automatically search enemy of max level.";
    this.prestigeLevel = 3;
    this.showResourceUsage = false;
  }
  execCondition(): boolean {
    if (!ResourceManager.getInstance().searchX1.unlocked) return false;

    const em = EnemyManager.getInstance();
    return (
      (this.enemyDefeated || !this.afterEnemyDefeat) &&
      em.searchJobs.length === 0 &&
      em.allEnemy.length < MAX_ENEMY_LIST_SIZE
    );
  }
  doAction(): boolean {
    const em = EnemyManager.getInstance();
    em.startSearching(
      this.maxLevel ? em.maxLevel : Math.min(em.maxLevel, this.userLevel)
    );
    this.enemyDefeated = false;
    return true;
  }
  getSave(): any {
    const data = super.getSave();
    data.ml = this.maxLevel;
    data.ul = this.userLevel;
    data.af = this.afterEnemyDefeat;
    return data;
  }
  load(data: any) {
    if (!super.load(data)) return false;
    if ("ml" in data) this.maxLevel = data.ml;
    if ("ul" in data) this.userLevel = data.ul;
    if ("af" in data) this.afterEnemyDefeat = data.af;
    return true;
  }
}

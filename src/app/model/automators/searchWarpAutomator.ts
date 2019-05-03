import { Automator } from "./automator";
import { DarkMatterManager } from "../darkMatter/darkMatterManager";
import { ResourceManager } from "../resource/resourceManager";
import { EnemyManager } from "../enemy/enemyManager";
import { Game } from "../game";

export class SearchWarpAutomator extends Automator {
  constructor() {
    super("SWA");
    this.name = "Auto Search Warp";
    this.description =
      "Automatically warp to complete searching; max warp is 1 hour";
    this.prestigeLevel = 25;
  }
  execCondition(): boolean {
    return (
      EnemyManager.getInstance().totalTime > 1000 &&
      EnemyManager.getInstance().totalTime < Number.POSITIVE_INFINITY
    );
  }
  doAction(): boolean {
    let requiredWarp = EnemyManager.getInstance().totalTime;
    requiredWarp = Math.min(requiredWarp, ResourceManager.getInstance().maxTime);

    requiredWarp = Math.ceil(requiredWarp / (60 * 1000));
    let maxWarp = DarkMatterManager.getInstance().warpMin.multiPrice.getMaxBuy(
      new Decimal(0),
      this.resourcePercentToUse
    );
    maxWarp = maxWarp.min(60);
    const toWarp = Decimal.min(requiredWarp, maxWarp);
    return Game.getInstance().setRequiredWarp(toWarp);
  }
}

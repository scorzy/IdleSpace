import { Automator } from "./automator";
import { Shipyard } from "../shipyard/shipyard";
import { DarkMatterManager } from "../darkMatter/darkMatterManager";
import { ResourceManager } from "../resource/resourceManager";

export class ShipyardWarp extends Automator {
  constructor() {
    super("SyA");
    this.name = "Auto Shipyard Jobs Warp";
    this.description = "Automatically warp to complete jobs; max warp is 1 hour";
    this.prestigeLevel = 15;
  }
  execCondition(): boolean {
    return (
      Shipyard.getInstance().totalTime > 1000 &&
      Shipyard.getInstance().totalTime < Number.POSITIVE_INFINITY &&
      ResourceManager.getInstance().alloy.quantity.gt(1)
    );
  }
  doAction(): boolean {
    let requiredWarp = Shipyard.getInstance().totalTime;
    requiredWarp = Math.min(requiredWarp, ResourceManager.getInstance().maxTime);

    requiredWarp = Math.ceil(requiredWarp / (60 * 1000));
    let maxWarp = DarkMatterManager.getInstance().warpMin.multiPrice.getMaxBuy(
      new Decimal(0),
      this.resourcePercentToUse
    );
    maxWarp = maxWarp.min(60);
    const toWarp = Decimal.min(requiredWarp, maxWarp);
    return DarkMatterManager.getInstance().warpMin.buy(new Decimal(toWarp));
  }
}

import { Resource } from "../resource/resource";
import { Automator } from "./automator";
import { ResourceManager } from "../resource/resourceManager";

export class StorageAutomator extends Automator {
  constructor(public material: Resource) {
    super(material.id + "A");
    this.name = "Buy storage when full";
    this.description =
      "Automatically buy " + material.name + " storage when full";
    this.resource = material;
    this.group = 2;
    this.prestigeLevel = 4;
  }
  execCondition(): boolean {
    return this.material.isCapped;
  }
  doAction(): boolean {
    const resMan = ResourceManager.getInstance();
    const maxBuy = this.material.actions[0].multiPrice.prices
      .find(p => p.spendable === resMan.habitableSpace)
      .getMaxBuy(this.material.actions[0].quantity, this.resourcePercentToUse);

    return maxBuy.lt(1) ? false : this.material.actions[0].buy(new Decimal(1));
  }
}

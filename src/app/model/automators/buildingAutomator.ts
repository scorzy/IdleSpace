import { Automator } from "./automator";
import { Resource } from "../resource/resource";

export class BuildingAutomator extends Automator {
  constructor(public building: Resource) {
    super(building.id + "R");
    this.name = "Buy " + building.name;
    this.description = "Automatically buy " + building.name;
    this.resource = building;
    this.stopWhenFactoryUi = false;
    this.prestigeLevel = 17;
  }

  execCondition(): boolean {
    return this.building.unlocked;
  }

  doAction(): boolean {
    const maxBuy = this.building.buyAction.multiPrice.getMaxBuy(
      this.building.buyAction.quantity,
      this.resourcePercentToUse
    );

    return maxBuy.lt(1) ? false : this.building.buyAction.buy(new Decimal(1));
  }
}

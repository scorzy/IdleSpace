import { Automator } from "./automator";
import { Resource } from "../resource/resource";

export class MineAutomator extends Automator {
  constructor(public robot: Resource) {
    super(robot.id + "M");
    this.name = "Buy " + robot.actions[1].name;
    this.description = "Automatically buy " + robot.actions[1].name;
    this.resource = robot;
    this.group = 2;
    this.prestigeLevel = 13;
  }
  execCondition(): boolean {
    return this.robot.isCapped;
  }
  doAction(): boolean {
    const maxBuy = this.robot.actions[1].multiPrice.getMaxBuy(
      this.robot.actions[1].quantity,
      this.resourcePercentToUse
    );

    return maxBuy.lt(1) ? false : this.robot.actions[1].buy(new Decimal(1));
  }
}

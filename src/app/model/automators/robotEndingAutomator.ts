import { Automator } from "./automator";
import { Resource } from "../resource/resource";

export class RobotEndingAutomator extends Automator {
  constructor(public robot: Resource, public material: Resource) {
    super(robot.id + "R");
    this.name = "Smart Buy " + robot.name;
    this.description =
      "Buy " +
      robot.name +
      " when " +
      material.name +
      " is ending and " +
      robot.name +
      " operativity is 100%";
    this.resource = robot;
    this.stopWhenFactoryUi = true;
    this.prestigeLevel = 10;
  }
  execCondition(): boolean {
    return (
      !this.robot.isCapped &&
      this.material.isEnding &&
      this.robot.operativity >= 100
    );
  }
  doAction(): boolean {
    const maxBuy = this.robot.buyAction.multiPrice.getMaxBuy(
      this.robot.buyAction.quantity,
      this.resourcePercentToUse
    );

    return maxBuy.lt(1) ? false : this.robot.buyAction.buy(new Decimal(1));
  }
}

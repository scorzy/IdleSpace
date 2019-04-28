import { ResourceGroup } from "../resource/resourceGroup";
import { GroupAutomator } from "./groupAutomator";
import { Resource } from "../resource/resource";
import { Action } from "../actions/abstractAction";

export class RobotGroupAutomator extends GroupAutomator {
  constructor(public robots: ResourceGroup, i: number) {
    super("g" + i, robots);
    this.name = "Auto " + i;
    this.stopWhenFactoryUi = true;
    this.description = "Multiple buy drones at same time";
    this.prestigeLevel = 18 + (i - 1) * 11;
  }
  getAction(resource: Resource): Action {
    return resource.buyAction;
  }
}

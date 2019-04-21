import { GroupAutomator } from "./groupAutomator";
import { ResourceGroup } from "../resource/resourceGroup";
import { Resource } from "../resource/resource";
import { Action } from "../actions/abstractAction";

export class MineGroupAutomator extends GroupAutomator {
  constructor(public robots: ResourceGroup, i: number) {
    super("1" + i, robots);
    this.name = "Exp " + i;
    this.stopWhenFactoryUi = false;
    this.description = "Multiple buy drones expansion";
    this.prestigeLevel = 18 + (i - 1) * 9;
  }
  getAction(resource: Resource): Action {
    return resource.actions[1];
  }
}

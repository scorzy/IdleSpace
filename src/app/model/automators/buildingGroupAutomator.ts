import { GroupAutomator } from "./groupAutomator";
import { ResourceGroup } from "../resource/resourceGroup";
import { Resource } from "../resource/resource";
import { Action } from "../actions/abstractAction";

export class BuildingGroupAutomator extends GroupAutomator {
  constructor(public robots: ResourceGroup, i: number) {
    super("b" + i, robots);
    this.name = "Auto " + i;
    this.stopWhenFactoryUi = false;
    this.description = "Multiple buy buildings at same time";
    this.prestigeLevel = 22 + (i - 1) * 11;
  }
  getAction(resource: Resource): Action {
    return resource.actions[0];
  }
}

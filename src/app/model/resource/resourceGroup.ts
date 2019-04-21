import { Resource } from "./resource";
import { GroupAutomator } from "../automators/groupAutomator";

export class ResourceGroup {
  isExpanded = true;
  unlockedResources = new Array<Resource>();
  selected = new Array<Resource>();
  action1Name = "";
  action2Name = "";
  automators = new Array<GroupAutomator>();
  unlockedAutomators = new Array<GroupAutomator>();

  constructor(
    public id: string,
    public name: string,
    public icon: string,
    public resources: Resource[]
  ) {
    this.reload();
  }
  reload() {
    this.unlockedResources = this.resources.filter(r => r.unlocked);
  }
}

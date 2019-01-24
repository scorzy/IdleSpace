import { Resource } from "./resource";

export class ResourceGroup {
  isExpanded = false;
  unlockedResources = new Array<Resource>();

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

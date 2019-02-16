import { Resource } from "./resource";

export class ResourceGroup {
  isExpanded = true;
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

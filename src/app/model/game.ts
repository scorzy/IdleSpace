import { Resource } from "./resource/resource";
import { ResourceManager } from "./resource/resourceManager";

export class Game {
  resourceManager: ResourceManager;

  constructor() {
    this.resourceManager = new ResourceManager();
  }
  update(diff: number): void {
    while (diff > 0) {
      this.resourceManager.loadPolynomial();
      let max = this.resourceManager.loadEndTime();
      if (max > diff) max = diff;
      diff -= max;
      this.resourceManager.update(max);
    }
  }
  save(): any {
    const save: any = {};
    save.r = this.resourceManager.getSave();
    return save;
  }
  load(data: any) {
    if (!("r" in data)) return false;
    this.resourceManager.load(data.r);
  }
}

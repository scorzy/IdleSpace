import { Resource } from "./resource/resource";
import { ResourceManager } from "./resource/resourceManager";

export class Game {
  resourceManager: ResourceManager;

  constructor() {
    this.resourceManager = new ResourceManager();
  }
  update(diff: number): void {
    while (diff > 0) {
      let resEnded = false;
      this.resourceManager.loadPolynomial();
      let max = this.resourceManager.loadEndTime();
      if (max > diff) {
        max = diff;
        resEnded = true;
      }
      diff -= max;
      this.resourceManager.update(max);
      if (resEnded) {
        this.resourceManager.stopResource();
      }
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

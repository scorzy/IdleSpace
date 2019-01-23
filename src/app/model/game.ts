import { Resource } from "./resource/resource";
import { ResourceManager } from "./resource/resourceManager";

export class Game {
  resourceManager: ResourceManager;

  constructor() {
    this.resourceManager = new ResourceManager();
  }
  update(diff: number): void {
    this.resourceManager.loadPolynomial();
    this.resourceManager.loadEndTime();
    this.resourceManager.update(diff);
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

import { ResourceManager } from "./resource/resourceManager";
import { ResearchManager } from "./research/researchManager";

export class Game {
  resourceManager: ResourceManager;
  researchManager: ResearchManager;

  constructor() {
    this.resourceManager = new ResourceManager();
    this.researchManager = new ResearchManager();

    this.resourceManager.metal.quantity = new Decimal(10000);
    this.resourceManager.crystal.quantity = new Decimal(10000);
  }
  update(diff: number): void {
    while (diff > 0) {
      let resEnded = false;
      this.resourceManager.loadPolynomial();
      let max = this.resourceManager.loadEndTime();
      if (max < diff) {
        max = diff;
        resEnded = true;
      }
      max = Math.min(max, diff);
      diff -= max;
      if (max > 0) this.resourceManager.update(max);
      if (resEnded) {
        this.resourceManager.stopResource();
      }
    }

    //  Convert computing to researches
    if (this.resourceManager.computing.quantity.gt(0)) {
      this.researchManager.update(this.resourceManager.computing.quantity);
      this.resourceManager.computing.quantity = new Decimal(0);
    }

    this.resourceManager.loadPolynomial();
    this.resourceManager.reloadActions();
    this.resourceManager.unlockedResources.forEach(r => r.setABC());
  }
  reload() {
    this.resourceManager.loadPolynomial();
    this.resourceManager.loadEndTime();
  }
  save(): any {
    const save: any = {};
    save.r = this.resourceManager.getSave();
    save.e = this.researchManager.getSave();
    return save;
  }
  load(data: any) {
    if (!("r" in data)) return false;
    this.resourceManager.load(data.r);
    this.researchManager.load(data.e);

    this.reload();
  }
}

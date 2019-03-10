import { ResourceManager } from "./resource/resourceManager";
import { ResearchManager } from "./research/researchManager";
import { BonusStack } from "./bonus/bonusStack";
import { Bonus } from "./bonus/bonus";
import { FleetManager } from "./fleet/fleetManager";

export class Game {
  resourceManager: ResourceManager;
  researchManager: ResearchManager;
  fleetManager: FleetManager;

  researchBonus: BonusStack;

  constructor() {
    this.resourceManager = new ResourceManager();
    this.researchManager = new ResearchManager();
    this.fleetManager = new FleetManager();

    this.researchManager.addOtherResearches();
    this.researchManager.setUnlocks();

    this.fleetManager.reload();

    this.resourceManager.metal.quantity = new Decimal(100000);
    this.resourceManager.crystal.quantity = new Decimal(100000);

    this.researchBonus = new BonusStack();
    this.researchBonus.multiplicativeBonus.push(
      new Bonus(this.researchManager.betterResearch, new Decimal(0.2))
    );
  }
  update(diff: number): void {
    while (diff > 0) {
      let resEnded = false;
      this.resourceManager.loadPolynomial();
      let max = this.resourceManager.loadEndTime();
      if (max < diff) {
        // max = diff;
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
      let computing = this.resourceManager.computing.quantity;
      computing = computing.times(this.researchBonus.getMultiplicativeBonus());
      this.researchManager.update(computing);

      this.resourceManager.computing.quantity = new Decimal(0);
    }

    this.resourceManager.loadPolynomial();
    this.resourceManager.reloadActions();
    this.resourceManager.unlockedResources.forEach(r => r.setABC());
    this.fleetManager.reloadActions();
  }
  reload() {
    this.resourceManager.loadPolynomial();
    this.resourceManager.loadEndTime();
  }
  save(): any {
    const save: any = {};
    save.r = this.resourceManager.getSave();
    save.e = this.researchManager.getSave();
    save.f = this.fleetManager.getSave();
    return save;
  }
  load(data: any) {
    if (!("r" in data)) return false;
    this.resourceManager.load(data.r);
    this.researchManager.load(data.e);
    this.fleetManager.load(data.f);

    this.reload();
  }
}

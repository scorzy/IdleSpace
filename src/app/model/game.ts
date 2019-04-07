import { ResourceManager } from "./resource/resourceManager";
import { ResearchManager } from "./research/researchManager";
import { BonusStack } from "./bonus/bonusStack";
import { Bonus } from "./bonus/bonus";
import { FleetManager } from "./fleet/fleetManager";
import { EnemyManager } from "./enemy/enemyManager";
import { Shipyard } from "./shipyard/shipyard";
import { PrestigeManager } from "./prestige/prestigeManager";

const ZERO_DECIMAL_IMMUTABLE = new Decimal(0);

export class Game {
  resourceManager: ResourceManager;
  researchManager: ResearchManager;
  fleetManager: FleetManager;
  enemyManager: EnemyManager;
  researchBonus: BonusStack;
  shipyard: Shipyard;
  prestigeManager: PrestigeManager;
  isPaused = false;

  constructor() {
    this.init();
  }
  init(prestige = false) {
    this.resourceManager = new ResourceManager();
    this.researchManager = new ResearchManager();
    this.fleetManager = new FleetManager();
    this.enemyManager = new EnemyManager();
    this.shipyard = new Shipyard();
    if (!prestige) this.prestigeManager = new PrestigeManager();

    this.researchManager.addOtherResearches();
    this.researchManager.setUnlocks();

    this.fleetManager.reload();

    this.resourceManager.metal.quantity = new Decimal(100000);
    this.resourceManager.crystal.quantity = new Decimal(100000);

    this.researchBonus = new BonusStack();
    this.researchBonus.multiplicativeBonus.push(
      new Bonus(this.researchManager.betterResearch, new Decimal(0.2))
    );

    this.resourceManager.allResources.forEach(
      r => (r.unlockedActions = r.actions.filter(a => a.unlocked))
    );
  }
  update(diff: number): void {
    if (!this.isPaused) {
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
        computing = computing.times(this.researchBonus.getTotalBonus());
        this.researchManager.update(computing);

        this.resourceManager.computing.quantity = new Decimal(0);
      }

      //  Convert ShipyardProgress to actual progress
      this.shipyard.addProgress(this.resourceManager.shipyardProgress.quantity);
      this.resourceManager.shipyardProgress.quantity = new Decimal(0);

      //  Convert SearchProgress to actual searching
      this.enemyManager.addProgress(
        this.resourceManager.searchProgress.quantity
      );
      this.resourceManager.searchProgress.quantity = ZERO_DECIMAL_IMMUTABLE;

      //  Deploy Drones
      this.resourceManager.deployDrones();
    }
    this.resourceManager.navalCap.quantity = new Decimal(0);

    this.resourceManager.limitedResources.forEach(r => {
      if (r.quantity.gt(r.limit)) {
        const difference = r.limit.minus(r.quantity);
        r.generators[0].producer.products.forEach(ref => {
          ref.product.quantity = ref.product.quantity.minus(
            difference.times(ref.prodPerSec)
          );
        });

        r.quantity = r.limit;
      }
    });
    this.resourceManager.loadPolynomial();
    if (this.isPaused) this.resourceManager.loadEndTime();

    this.resourceManager.reloadActions();
    this.resourceManager.unlockedResources.forEach(r => r.setABC());
    this.fleetManager.reloadActions();
    this.fleetManager.isBuildingCheckAll();
    if (!this.isPaused) this.fleetManager.doAutoFight();
    this.shipyard.adjust();
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
    save.w = this.enemyManager.getSave();
    save.s = this.shipyard.getSave();
    save.p = this.prestigeManager.getSave();
    return save;
  }
  load(data: any) {
    if (!("r" in data)) return false;
    this.resourceManager.load(data.r);
    this.researchManager.load(data.e);
    this.fleetManager.load(data.f);
    if ("w" in data) this.enemyManager.load(data.w);
    if ("s" in data) this.shipyard.load(data.s);
    if ("p" in data) this.prestigeManager.load(data.p);

    this.resourceManager.habitableSpace.quantity = new Decimal(100);
    this.resourceManager.miningDistrict.quantity = new Decimal(100);
    this.resourceManager.crystalDistrict.quantity = new Decimal(100);

    // this.resourceManager.materials.forEach(m => {
    //   m.quantity = new Decimal(1e20);
    // });
    this.enemyManager.maxLevel = 50;
    this.prestigeManager.totalPrestige = 100;

    this.fleetManager.upgradingCheck();
    this.resourceManager.limitedResources.forEach(r => r.reloadLimit());
    this.reload();
  }

  prestige() {
    this.prestigeManager.totalPrestige = Math.max(
      this.prestigeManager.totalPrestige,
      this.enemyManager.maxLevel
    );
    this.init(true);
    this.resourceManager.limitedResources.forEach(r => r.reloadLimit());
  }
}

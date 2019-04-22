import { ResourceManager } from "./resource/resourceManager";
import { ResearchManager } from "./research/researchManager";
import { BonusStack } from "./bonus/bonusStack";
import { Bonus } from "./bonus/bonus";
import { FleetManager } from "./fleet/fleetManager";
import { EnemyManager } from "./enemy/enemyManager";
import { Shipyard } from "./shipyard/shipyard";
import { PrestigeManager } from "./prestige/prestigeManager";
import { DarkMatterManager } from "./darkMatter/darkMatterManager";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { AllSkillEffects } from "./prestige/allSkillEffects";
import { AutomatorManager } from "./automators/automatorManager";

export const ZERO_DECIMAL_IMMUTABLE = new Decimal(0);

export class Game {
  private static instance: Game;

  resourceManager: ResourceManager;
  researchManager: ResearchManager;
  fleetManager: FleetManager;
  enemyManager: EnemyManager;
  researchBonus: BonusStack;
  shipyard: Shipyard;
  prestigeManager: PrestigeManager;
  darkMatterManager: DarkMatterManager;
  automatorManager: AutomatorManager;
  isPaused = false;

  constructor() {
    Game.instance = this;
    this.init();
  }
  static getInstance(): Game {
    return Game.instance;
  }
  init(prestige = false) {
    this.researchBonus = new BonusStack();
    this.resourceManager = new ResourceManager();
    this.researchManager = new ResearchManager();
    this.fleetManager = new FleetManager();
    this.enemyManager = new EnemyManager();
    this.shipyard = new Shipyard();
    if (!prestige) {
      this.prestigeManager = new PrestigeManager();
      this.darkMatterManager = new DarkMatterManager(this);
      this.automatorManager = new AutomatorManager();
    }

    this.researchManager.addOtherResearches();
    this.researchManager.setUnlocks();

    this.fleetManager.reload();
    this.resourceManager.metal.quantity = new Decimal(200);
    this.resourceManager.crystal.quantity = new Decimal(120);
    this.resourceManager.habitableSpace.quantity = new Decimal(15);
    this.resourceManager.miningDistrict.quantity = new Decimal(2);
    this.resourceManager.crystalDistrict.quantity = new Decimal(2);
    // this.darkMatterManager.darkMatter.quantity = new Decimal(1e10);

    this.researchBonus.multiplicativeBonus.push(
      new Bonus(this.researchManager.betterResearch, new Decimal(0.2))
    );

    this.resourceManager.allResources.forEach(
      r => (r.unlockedActions = r.actions.filter(a => a.unlocked))
    );

    if (!prestige) this.automatorManager.generateAutomators();
    this.automatorManager.assignToResource();
  }
  /**
   * Main update loop
   * @param diff difference in milliseconds
   * @param warp true if time warp
   */
  update(diff: number, warp = false): void {
    if (!this.isPaused || warp) {
      if (warp && OptionsService.warpNotification) {
        MainService.toastr.show(
          MainService.endInPipe.transform(diff * 1000),
          "Time Warp",
          {},
          "toast-warp"
        );
      }
      let n = 0;
      while (diff > 0 && n < 50) {
        n++;
        let resEnded = false;
        this.resourceManager.loadPolynomial();
        let max = this.resourceManager.loadEndTime();
        // console.log(max);
        if (max < diff) {
          resEnded = true;
        }
        max = Math.min(max, diff);
        diff -= max;
        if (max > 0) this.resourceManager.update(max);
        if (resEnded) {
          this.resourceManager.stopResource();
        }
      }
      if (n > 49) {
        console.log("This should not happening. Game loop is looping too much.");
      }

      //  Convert computing to researches
      const totalResearchBonus = this.researchBonus.getTotalBonus();
      this.researchManager.researchPerSec = this.resourceManager.computing.c.times(
        totalResearchBonus
      );
      if (this.resourceManager.computing.quantity.gt(0)) {
        let computing = this.resourceManager.computing.quantity;
        computing = computing.times(totalResearchBonus);
        this.researchManager.update(computing);
        this.resourceManager.computing.quantity = new Decimal(0);
      }
      this.researchManager.reloadTimes();

      //  Convert ShipyardProgress to actual progress
      this.shipyard.addProgress(this.resourceManager.shipyardProgress.quantity);
      this.resourceManager.shipyardProgress.quantity = new Decimal(0);
      this.shipyard.reloadTimes();

      //  Convert SearchProgress to actual searching
      this.enemyManager.addProgress(
        this.resourceManager.searchProgress.quantity
      );
      this.resourceManager.searchProgress.quantity = ZERO_DECIMAL_IMMUTABLE;
      this.enemyManager.reloadTimes();

      //  Deploy Drones
      this.resourceManager.deployDrones();

      //  Automation
      if (!warp) {
        this.automatorManager.update(Date.now());
      }
    }

    this.resourceManager.navalCap.quantity = new Decimal(0);

    this.resourceManager.limitedResources.forEach(r => {
      if (r.quantity.gt(r.limit)) {
        // const difference = r.limit.minus(r.quantity);
        // r.generators[0].producer.products.forEach(ref => {
        //   ref.product.quantity = ref.product.quantity.minus(
        //     difference.times(ref.prodPerSec)
        //   );
        // });

        r.quantity = r.limit;
      }
    });

    this.resourceManager.loadPolynomial();
    if (this.isPaused) this.resourceManager.loadEndTime();

    this.resourceManager.reloadActions();
    this.resourceManager.unlockedResources.forEach(r => r.setABC());
    this.fleetManager.reloadActions();
    this.fleetManager.disbandShips();
    this.fleetManager.isBuildingCheckAll();
    this.fleetManager.setFight();
    this.fleetManager.doAutoFight();
    this.shipyard.adjust();
    this.darkMatterManager.reload();
    this.enemyManager.nukeAction.reload();
  }
  reload() {
    this.resourceManager.loadPolynomial();
    this.resourceManager.loadEndTime();
  }
  prestige() {
    this.darkMatterManager.darkMatter.quantity = this.darkMatterManager.darkMatter.quantity.plus(
      this.resourceManager.inactiveDarkMatter.quantity
    );
    this.prestigeManager.totalPrestige = Math.max(
      this.prestigeManager.totalPrestige,
      this.enemyManager.maxLevel - 1
    );
    this.prestigeManager.totalPrestige = Math.min(
      this.prestigeManager.totalPrestige,
      this.prestigeManager.maxPrestigePoints
    );
    this.init(true);
    this.resourceManager.limitedResources.forEach(r => r.reloadLimit());
    this.prestigeManager.reloadPrestigeToEarn();
    AllSkillEffects.initialize(true);
    this.resourceManager.allResources.forEach(r => {
      r.unlockedAutomators = r.automators.filter(a => a.isUnlocked());
      r.unlockedAutomators2 = r.automators2.filter(a => a.isUnlocked());
    });
    this.resourceManager.tierGroups.forEach(h => {
      h.unlockedAutomators = h.automators.filter(g => g.isUnlocked());
    });
    this.automatorManager.resetTimers();
  }

  //#region Save and Load
  save(): any {
    const save: any = {};
    save.r = this.resourceManager.getSave();
    save.e = this.researchManager.getSave();
    save.f = this.fleetManager.getSave();
    save.w = this.enemyManager.getSave();
    save.s = this.shipyard.getSave();
    save.p = this.prestigeManager.getSave();
    save.d = this.darkMatterManager.getSave();
    save.a = this.automatorManager.getSave();
    return save;
  }
  load(data: any) {
    if (typeof data === "undefined") return false;
    if (!("r" in data)) return false;
    if ("p" in data) this.prestigeManager.load(data.p);
    this.resourceManager.load(data.r);
    this.researchManager.load(data.e);
    this.fleetManager.load(data.f);
    if ("w" in data) this.enemyManager.load(data.w);
    if ("s" in data) this.shipyard.load(data.s);
    if ("d" in data) this.darkMatterManager.load(data.d);
    if ("a" in data) this.automatorManager.load(data.a);

    this.researchManager.fixUnlocks();

    // this.resourceManager.habitableSpace.quantity = new Decimal(100);
    // this.resourceManager.miningDistrict.quantity = new Decimal(100);
    // this.resourceManager.crystalDistrict.quantity = new Decimal(100);
    // this.darkMatterManager.darkMatter.quantity = new Decimal(1e4);
    // this.darkMatterManager.darkMatter.unlock();
    // this.resourceManager.metal.quantity = new Decimal();

    // this.resourceManager.materials.forEach(m => {
    //   m.quantity = new Decimal(1e20);
    // });
    // this.enemyManager.maxLevel = 50;
    // this.prestigeManager.totalPrestige = 100;

    this.fleetManager.upgradingCheck();
    this.resourceManager.limitedResources.forEach(r => r.reloadLimit());
    this.reload();
    this.prestigeManager.reloadPrestigeToEarn();
    this.resourceManager.allResources.forEach(r => {
      r.unlockedAutomators = r.automators.filter(a => a.isUnlocked());
      r.unlockedAutomators2 = r.automators2.filter(a => a.isUnlocked());
    });
    this.resourceManager.tierGroups.forEach(h => {
      h.unlockedAutomators = h.automators.filter(g => g.isUnlocked());
    });
    this.automatorManager.resetTimers();
  }
  //#endregion
}

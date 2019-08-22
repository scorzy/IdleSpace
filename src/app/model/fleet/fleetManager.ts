import { ISalvable } from "../base/ISalvable";
import { ShipDesign } from "./shipDesign";
import { ShipType } from "./shipTypes";
import { Module } from "./module";
import { ModulesData } from "./moduleData";
import { Resource } from "../resource/resource";
import { Shipyard } from "../shipyard/shipyard";
import { Job } from "../shipyard/job";
import { EnemyManager } from "../enemy/enemyManager";
import { ResourceManager } from "../resource/resourceManager";
import { ResearchManager } from "../research/researchManager";
import { AllSkillEffects } from "../prestige/allSkillEffects";
import sample from "lodash-es/sample";
import { MainService } from "src/app/main.service";
import { ShipClass } from "./class";

export const MAX_NAVAL_CAPACITY = 1e4;
export const MAX_DESIGN = 20;
const DISBAND_INTERVAL = 60 * 1000 * 2; //  5 minutes
const DISBAND_PERCENT = 0.3;
export const MAX_SHIP = 1e4;

export class FleetManager implements ISalvable {
  private static instance: FleetManager;

  totalNavalCapacity = new Decimal(20);
  ships = new Array<ShipDesign>();
  freeNavalCapacity: Resource;
  usedNavalCapacity = new Decimal(0);
  usedNavalCapacityShips = new Decimal(0);
  totalShips = new Decimal(0);

  allModules = new Array<Module>();
  unlockedModules = new Array<Module>();
  armor: Module;

  totalWantedNavalCap = new Decimal(0);
  configurationValid = true;

  autoFight = false;
  autoReinforce = false;
  fullStrength = false;
  fightEnabled = false;
  lastFleetDisband = Date.now();
  autoFightPer = 100;
  isUsed = false;
  totalShipWant = 0;
  timePerFight = 1;
  maxTilePerFight = 0;

  constructor() {
    FleetManager.instance = this;
    this.freeNavalCapacity = new Resource("N");
    for (const data of ModulesData) this.allModules.push(Module.fromData(data));
    this.armor = this.allModules.find(m => m.id === "a");
  }
  static getInstance(): FleetManager {
    return FleetManager.instance;
  }

  reload() {
    this.allModules.forEach(m => m.reload());
    this.unlockedModules = this.allModules.filter(w => w.unlocked);
  }
  reloadActions() {
    this.reloadNavalCapacity();
    this.ships.forEach(s => {
      s.buyAction.reload();
    });
  }
  getNavalCapacityFromDrones(): Decimal {
    const navalCapRes = ResourceManager.getInstance().navalCap;
    return navalCapRes.c;
  }
  reloadNavalCapacity() {
    this.totalNavalCapacity = new Decimal(20).plus(
      this.getNavalCapacityFromDrones()
    );

    const resMan = ResearchManager.getInstance();
    this.totalNavalCapacity = this.totalNavalCapacity.plus(
      resMan.completed
        .filter(r => r.navalCapacity > 0)
        .map(r => r.navalCapacity)
        .reduce((a, b) => a + b, 0)
    );
    this.totalNavalCapacity = this.totalNavalCapacity.times(
      AllSkillEffects.DOUBLE_NAVAL_CAPACITY.numOwned * 0.5 + 1
    );

    // this.totalNavalCapacity = this.totalNavalCapacity.min(MAX_NAVAL_CAPACITY);

    this.totalShips = this.ships
      .map(s => s.quantity)
      .reduce((p, c) => p.plus(c), new Decimal(0));

    this.usedNavalCapacityShips = ShipDesign.GetTotalNavalCap(this.ships);
    this.usedNavalCapacity = this.usedNavalCapacityShips.plus(
      Shipyard.getInstance().getTotalNavalCapacity()
    );
    this.freeNavalCapacity.quantity = this.totalNavalCapacity.minus(
      this.usedNavalCapacity
    );
    this.reloadSliders();
  }
  addDesign(name: string, type: ShipType, shipClass: ShipClass): ShipDesign {
    const design = new ShipDesign();
    design.class = shipClass;

    design.id =
      "" +
      (this.ships
        .map(s => parseInt(s.id, 10))
        .reduce((p, c) => Math.max(p, c), 0) +
        1);
    design.name = name;
    design.type = type;

    design.reload();
    this.ships.push(design);
    return design;
  }
  deleteDesign(ds: ShipDesign) {
    this.ships = this.ships.filter(d => d !== ds);
    Shipyard.getInstance().delete(ds);
  }
  getSave() {
    const data: any = {};
    data.s = this.ships.map(s => s.getSave());
    if (this.autoFight) data.f = this.autoFight;
    if (this.autoReinforce) data.r = this.autoReinforce;
    if (this.autoFightPer !== 100) data.a = this.autoFightPer;
    return data;
  }
  load(data: any): boolean {
    if ("s" in data) {
      for (const shipData of data.s) {
        const ship = new ShipDesign();
        ship.load(shipData);
        this.ships.push(ship);
      }
    }
    if ("f" in data) this.autoFight = data.f;
    if ("r" in data) this.autoReinforce = data.r;
    if ("a" in data) this.autoFightPer = data.a;
    this.reload();
    this.reloadNavalCapacity();
    return true;
  }
  reorderModules() {
    this.unlockedModules.sort(
      (a, b) =>
        ModulesData.findIndex(q => q.id === a.id) -
        ModulesData.findIndex(h => h.id === b.id)
    );
  }
  upgradingCheck() {
    this.ships.forEach(s => {
      s.isUpgrading = Shipyard.getInstance().isUpgrading(s);
    });
  }
  isBuildingCheckAll() {
    this.ships.forEach(s => s.isBuildingCheck());
  }
  resetSliders() {
    this.ships.forEach(s => {
      s.wantQuantityTemp = s.wantQuantity.toNumber();
    });
  }
  getTotalShip(): number {
    return Shipyard.getInstance().getNumOfShip();
    // return (
    //   this.ships.map(s => s.quantity.toNumber()).reduce((p, c) => p + c, 0) +
    //   Shipyard.getInstance().getNumOfShip()
    // );
  }
  getWantShip(): number {
    return this.ships.map(s => s.wantQuantityTemp).reduce((p, c) => p + c, 0);
  }
  reloadSliders() {
    const av = this.totalNavalCapacity
      .minus(this.totalWantedNavalCap)
      .toNumber();
    this.totalShipWant = this.getWantShip(); // this.getTotalShip() +
    const availableQty = MAX_SHIP - this.totalShipWant;

    this.ships.forEach(s => {
      s.sliderOptions.ceil = Math.min(
        s.wantQuantityTemp + Math.floor(av / s.type.navalCapacity),
        Math.floor(
          Math.floor(this.totalNavalCapacity.toNumber()) / s.type.navalCapacity
        ),
        availableQty + s.wantQuantityTemp
      );

      s.sliderOptions.step = 1;
    });
  }
  sliderChange() {
    this.totalWantedNavalCap = this.ships
      .map(s => new Decimal(s.type.navalCapacity).times(s.wantQuantityTemp))
      .reduce((p, c) => p.plus(c), new Decimal(0));
    this.configurationValid = this.totalNavalCapacity.gte(
      this.totalWantedNavalCap
    );
    const totalWantShip = this.getWantShip(); // +this.getTotalShip();

    this.configurationValid =
      totalWantShip <= MAX_SHIP &&
      this.configurationValid &&
      this.ships.findIndex(s => s.wantQuantityTemp < 0) === -1 &&
      this.ships.findIndex(s => isNaN(s.wantQuantityTemp)) === -1;
  }
  save(): boolean {
    this.sliderChange();
    if (!this.configurationValid) return false;
    this.ships.forEach(s => {
      s.wantQuantity = new Decimal(s.wantQuantityTemp);
    });
    return true;
  }
  make() {
    this.ships.forEach(s => {
      let qta = s.quantity.plus(Shipyard.getInstance().getTotalShips(s));
      let diff = s.wantQuantity.minus(qta);
      if (diff.lt(0)) {
        Shipyard.getInstance().delete(s);
      }
      qta = s.quantity.plus(Shipyard.getInstance().getTotalShips(s));
      diff = s.wantQuantity.minus(qta);
      if (diff.gt(0)) {
        const job = new Job();
        job.design = s;
        job.quantity = diff;
        job.total = diff.times(s.price);
        Shipyard.getInstance().jobs.push(job);
      } else {
        s.quantity = s.quantity.plus(diff);
      }
    });
  }
  getTotalPrice(): Decimal {
    let ret = new Decimal();
    this.ships.forEach(s => {
      let qta = s.quantity.plus(Shipyard.getInstance().getTotalShips(s));
      const wantQta = new Decimal(s.wantQuantityTemp);
      let diff = wantQta.minus(qta);
      qta = s.quantity.plus(Shipyard.getInstance().getTotalShips(s));
      diff = wantQta.minus(qta);
      if (diff.gt(0)) {
        ret = ret.plus(diff.times(s.price));
      }
    });
    return ret;
  }

  checkStatus() {
    this.fullStrength =
      this.ships.findIndex(s => s.quantity.lt(s.wantQuantity)) === -1;
  }
  doAutoFight() {
    MainService.navalCapReinforceToast = false;
    this.checkStatus();
    const overNavalCap = ShipDesign.GetWantNavalCap(this.ships).gt(
      this.totalNavalCapacity
    );

    const enemyManager = EnemyManager.getInstance();
    if (this.fightEnabled) {
      let autoFightOk = this.fullStrength || !this.autoReinforce;

      if (!this.fullStrength && this.autoReinforce) {
        const percent = isNaN(this.autoFightPer)
          ? 100
          : Math.max(Math.min(this.autoFightPer, 100), 0);

        const navalCapPercent = ShipDesign.GetTotalNavalCap(this.ships).div(
          ShipDesign.GetWantNavalCap(this.ships)
        );

        // console.log(percent / 100 + "  " + navalCapPercent.toNumber());
        autoFightOk = Decimal.gte(navalCapPercent, percent / 100);
      }

      // console.log("OK " + autoFightOk);
      if (
        !enemyManager.inBattle &&
        this.autoFight &&
        !overNavalCap &&
        autoFightOk
      ) {
        if (enemyManager.autoNuke) {
          enemyManager.mergeTiles();
          enemyManager.nukeAction.reload();
          if (enemyManager.nukeAction.maxBuy.gt(0)) {
            enemyManager.nukeAction.buy(enemyManager.nukeAction.maxBuy);
          }
        }
        enemyManager.startBattle();
      }
    }

    if (
      enemyManager.autoNext &&
      !enemyManager.currentEnemy &&
      enemyManager.allEnemy.length > 0
    ) {
      enemyManager.attack(enemyManager.allEnemy[0]);
    }

    if (this.autoReinforce && !this.fullStrength) {
      if (!overNavalCap) {
        this.make();
      } else {
        MainService.navalCapReinforceToast = true;
      }
    }
  }
  setFight() {
    this.fightEnabled = this.ships.findIndex(s => s.quantity.gte(1)) > -1;
  }
  /**
   * Disband random ships
   */
  disbandShips() {
    if (this.usedNavalCapacityShips.lte(this.totalNavalCapacity)) {
      this.lastFleetDisband = Date.now();
    } else if (Date.now() - this.lastFleetDisband > DISBAND_INTERVAL) {
      //  Disband Ships
      let diff = this.totalNavalCapacity.minus(this.usedNavalCapacityShips);
      diff = diff.times(DISBAND_PERCENT);
      const ships = this.ships.filter(s => s.quantity.gte(1));
      const randomShip = sample(ships);
      const toRemove = Decimal.min(
        randomShip.quantity,
        diff
          .div(randomShip.type.navalCapacity)
          .max(1)
          .ceil()
      );
      if (toRemove.gte(1)) {
        this.lastFleetDisband = Date.now();
        randomShip.quantity = randomShip.quantity.minus(toRemove);
        MainService.toastr.warning(
          MainService.formatPipe.transform(toRemove, true) +
            " " +
            randomShip.name +
            " lost",
          "Exceeding Naval Capacity"
        );
        this.reloadNavalCapacity();
      }
    }
  }
  /**
   * Reload max tile /s
   */
  reloadFightTime() {
    this.timePerFight = 1;
    this.maxTilePerFight = 0;
    let tilePerSec = this.ships
      .filter(s => s.quantity.gt(0))
      .map(s => s.totalTilePerSec)
      .reduce((p, n) => Math.min(p, n), Number.POSITIVE_INFINITY);

    if (tilePerSec === Number.POSITIVE_INFINITY) return false;

    tilePerSec += AllSkillEffects.FAST_COMBAT.numOwned * 0.25;
    tilePerSec = tilePerSec * (AllSkillEffects.TILE_MERGE.numOwned * 0.2 + 1);
    this.timePerFight = Math.floor(Math.max(1 / tilePerSec, 0.2) * 100) / 100;
    this.maxTilePerFight = Math.floor(tilePerSec / 5);
    const em = EnemyManager.getInstance();
    if (em) {
      em.mergeLevel = Math.min(em.mergeLevel, this.maxTilePerFight);
    }
  }
}

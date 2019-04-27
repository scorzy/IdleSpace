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

export const MAX_NAVAL_CAPACITY = 1e4;
export const MAX_DESIGN = 20;
const DISBAND_INTERVAL = 60 * 1000 * 5; //  5 minutes
const DISBAND_PERCENT = 0.3;

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

  totalWantedNavalCap = 0;
  configurationValid = true;

  autoFight = false;
  autoReinforce = false;
  fullStrength = false;
  fightEnabled = false;
  lastFleetDisband = Date.now();

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

    this.totalNavalCapacity = this.totalNavalCapacity.min(MAX_NAVAL_CAPACITY);

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
  addDesign(name: string, type: ShipType): ShipDesign {
    const design = new ShipDesign();

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
  reloadSliders() {
    const av = this.totalNavalCapacity.toNumber();
    this.ships.forEach(s => {
      s.sliderOptions.ceil = Math.floor(av / s.type.navalCapacity);
      s.sliderOptions.step = 1;
    });
  }
  sliderChange() {
    this.totalWantedNavalCap = this.ships
      .map(s => s.type.navalCapacity * s.wantQuantityTemp)
      .reduce((p, c) => p + c, 0);
    this.configurationValid = this.totalNavalCapacity.gte(
      this.totalWantedNavalCap
    );
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
    if (this.autoReinforce && !this.fullStrength) {
      if (!overNavalCap) {
        this.make();
      } else {
        MainService.navalCapReinforceToast = true;
      }
    }

    if (this.fightEnabled) {
      const enemyManager = EnemyManager.getInstance();
      if (
        !enemyManager.inBattle &&
        this.autoFight &&
        (this.fullStrength || !this.autoReinforce || overNavalCap)
      ) {
        if (enemyManager.autoNuke) {
          enemyManager.nukeAction.reload();
          if (enemyManager.nukeAction.maxBuy.gt(0)) {
            enemyManager.nukeAction.buy(enemyManager.nukeAction.maxBuy);
          }
        }
        enemyManager.startBattle();
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
}

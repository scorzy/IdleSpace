import { ShipType, ShipTypes, DefenseTypes } from "./shipTypes";
import { ISalvable } from "../base/ISalvable";
import { DesignLine } from "./designLine";
import { Action } from "../actions/abstractAction";
import { IBuyable } from "../base/IBuyable";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";
import { FleetManager } from "./fleetManager";
import { Preset } from "../enemy/preset";
import sample from "lodash-es/sample";
import { Sizes } from "./module";
import { ShipData } from "src/app/workers/battleRequest";
import { Job } from "../shipyard/job";
import { Shipyard } from "../shipyard/shipyard";
import { SliderOptions } from "../utility/sliderOptions";

export const SIZE_MULTI = 0.25;

export class ShipDesign implements ISalvable, IBuyable {
  id: string;
  type: ShipType;
  name = "";
  shipQuantity = new Decimal(0);

  modules = new Array<DesignLine>();

  totalDamage = new Decimal();
  totalArmor = new Decimal();
  totalShield = new Decimal();
  totalEnergy = new Decimal();
  armorDamage = new Decimal();
  shieldDamage = new Decimal();
  price = new Decimal();
  totalFleetPower = new Decimal();
  explosionChance = 30;

  editable: ShipDesign;
  original: ShipDesign;
  usedModulePoint = 0;
  isValid = true;

  buyAction: Action;
  actions = new Array<Action>();
  quantity = new Decimal();
  wantQuantity = new Decimal();
  isLimited = false;
  limit = new Decimal();
  isCapped = false;
  upgradePrice = new Decimal();
  weight = 1;
  isUpgrading = false;
  isBuilding = false;

  wantQuantityTemp = 0;
  sliderOptions: SliderOptions = {
    floor: 0,
    ceil: 100
  };
  order = 0;

  /**
   * Generate Ships from presets
   */
  static fromPreset(preset: Preset, weapons = 0): ShipDesign {
    const shipDesign = new ShipDesign();
    shipDesign.name = preset.name;
    shipDesign.type = preset.type;
    shipDesign.modules = preset.modules.map(dm => {
      let toSelect = dm.id;
      if (weapons > 0 && toSelect.length > 2) {
        const halfWay = Math.floor(toSelect.length / 2);
        toSelect =
          weapons === 1
            ? toSelect.slice(0, halfWay)
            : toSelect.slice(halfWay, toSelect.length);
      }
      const chosen = sample(toSelect);
      return new DesignLine(
        FleetManager.getInstance().allModules.find(m => m.id === chosen),
        dm.size
      );
    });
    shipDesign.reload();

    //  Complete with armor
    const availableModules =
      shipDesign.type.moduleCount - shipDesign.modules.length;
    let availableModulePoints =
      shipDesign.type.modulePoint - shipDesign.usedModulePoint;

    if (availableModulePoints > 0) {
      let armor = shipDesign.modules.find(
        m => m.module.id === FleetManager.getInstance().armor.id
      );
      if (!armor && availableModules > 0) {
        armor = new DesignLine(FleetManager.getInstance().armor);
        shipDesign.modules.push(armor);
        availableModulePoints--;
      }
      if (armor) {
        armor.size = armor.size + availableModulePoints;
        armor.size = Math.min(armor.size, Sizes.ExtraLarge);
      }
    }

    shipDesign.reload();
    return shipDesign;
  }

  static GetTotalNavalCap(ships: ShipDesign[]): Decimal {
    return ships
      .map(s => s.quantity.times(s.type.navalCapacity))
      .reduce((p, c) => p.plus(c), new Decimal(0));
  }
  static GetWantNavalCap(ships: ShipDesign[]): Decimal {
    return ships
      .map(s => s.wantQuantity.times(s.type.navalCapacity))
      .reduce((p, c) => p.plus(c), new Decimal(0));
  }

  reload(isPlayer = true) {
    this.totalDamage = new Decimal(0);
    this.totalShield = new Decimal(0);
    this.totalEnergy = new Decimal(0);
    this.armorDamage = new Decimal(0);
    this.shieldDamage = new Decimal(0);
    this.totalFleetPower = new Decimal(0);
    this.totalArmor = new Decimal(this.type ? this.type.health : 0);
    this.usedModulePoint = 0;
    this.price = new Decimal(this.type.baseCost);
    this.explosionChance = 30;

    this.modules
      .filter(q => q.isValid())
      .forEach(w => {
        const multiPrice = w.level / 8; // * Math.log(w.level * MODULE_PRICE_INCREASE);
        // const multiPrice = 1 + (w.level - 10) / 5;
        const bonus = w.level / 10;
        const sizeFactor = w.size + (w.size - 1) * SIZE_MULTI;

        this.usedModulePoint += w.size;

        w.computedDamage = w.module.damage.times(bonus).times(sizeFactor);
        this.totalDamage = this.totalDamage.plus(w.computedDamage);
        this.totalEnergy = this.totalEnergy.plus(
          w.module.energyBalance.times(bonus).times(w.size)
        );
        this.totalArmor = this.totalArmor.plus(
          w.module.armor.times(bonus).times(sizeFactor)
        );
        this.totalShield = this.totalShield.plus(
          w.module.shield.times(bonus).times(sizeFactor)
        );

        if (w.module.armorPercent > 0) {
          this.armorDamage = this.armorDamage.plus(
            w.module.damage
              .times(bonus)
              .times(sizeFactor)
              .times(w.module.armorPercent / 100)
          );
        }
        if (w.module.shieldPercent > 0) {
          this.shieldDamage = this.shieldDamage.plus(
            w.module.damage
              .times(bonus)
              .times(sizeFactor)
              .times(w.module.shieldPercent / 100)
          );
        }

        this.price = this.price.plus(
          w.module.alloyPrice.times(1 + (w.size - 1) * 2).times(multiPrice)
        );

        this.explosionChance +=
          w.module.explosionChance * (1 + (w.size - 1) * 0.2);
      });

    this.totalFleetPower = this.totalDamage
      .plus(this.totalShield)
      .plus(this.totalArmor);

    if (this.type.defense) this.totalEnergy = new Decimal(0);

    this.isValid =
      this.totalEnergy.gte(0) &&
      this.usedModulePoint <= this.type.modulePoint &&
      this.modules.length <= this.type.moduleCount;

    this.upgradePrice = !!this.original
      ? this.price
          .minus(this.original.price)
          .max(0)
          .times(
            this.original.quantity.plus(
              Shipyard.getInstance().getTotalShips(this.original)
            )
          )
      : new Decimal();

    if (isPlayer) this.generateBuyAction();
  }
  getSave(): any {
    const data: any = {};
    data.i = this.id;
    if (!this.shipQuantity.eq(0)) data.q = this.shipQuantity;
    data.t = this.type.id;

    data.n = this.name;
    data.m = this.modules.filter(m => m.isValid()).map(m => m.getSave());
    if (this.quantity.gt(0)) data.q = this.quantity;
    if (this.wantQuantity.gt(0)) data.w = this.wantQuantity;

    return data;
  }
  load(data: any, isPlayer = true): boolean {
    this.id = data.i;
    if ("q" in data) this.shipQuantity = Decimal.fromDecimal(data.q);
    this.type = ShipTypes.find(t => t.id === data.t);

    if (this.type === null || this.type === undefined) {
      this.type = DefenseTypes.find(t => t.id === data.t);
    }

    if (this.type === null || this.type === undefined) {
      if (isPlayer) {
        const num = Number.parseInt(data.t, 10);
        this.type = ShipType.GetTitan(num - 7);
      } else {
        this.type = DefenseTypes.find(t => t.name === data.n);
        if (this.type === null || this.type === undefined) {
          this.type = DefenseTypes[0];
        }
        this.type.defense = true;
      }
    }

    if (!this.type) this.type = DefenseTypes.find(t => t.id === data.t);
    this.name = data.n;
    if ("m" in data) {
      for (const modData of data.m) {
        this.modules.push(DesignLine.CreateFromData(modData));
      }
    }
    if ("q" in data) {
      this.quantity = Decimal.fromDecimal(data.q);
    }
    if ("w" in data) {
      this.wantQuantity = Decimal.fromDecimal(data.w);
    }

    this.reload(isPlayer);
    return true;
  }
  copy() {
    this.editable = new ShipDesign();
    this.editable.original = this;
    this.editable.name = this.name;
    this.editable.id = this.id;
    this.editable.type = this.type;
    this.editable.shipQuantity = new Decimal(this.shipQuantity);
    this.modules.forEach(w => {
      this.editable.modules.push(DesignLine.copy(w));
    });

    this.editable.reload();
  }
  getCopy(): ShipDesign {
    const ret = new ShipDesign();
    ret.id = this.id;
    ret.type = this.type;
    ret.name = this.name;
    ret.modules = this.modules;
    ret.order = this.order;
    ret.reload(false);
    return ret;
  }
  addModule() {
    this.editable.modules.push(new DesignLine());
    this.editable.reload();
  }
  removeModule(i: number) {
    this.editable.modules.splice(i, 1);
    this.editable.reload();
  }
  maxAll(): boolean {
    let done = false;
    this.editable.modules.forEach(m => {
      done = done || m.level < m.maxLevel;
      m.level = m.maxLevel;
      m.levelUi = m.level;
    });
    this.editable.reload();
    return done;
  }
  /**
   * Return true if an upgrade is queued
   */
  saveConfig(): boolean {
    if (!(this.editable && this.editable.isValid && !this.isUpgrading)) {
      return false;
    }
    this.editable.modules = this.editable.modules.filter(m => m.isValid());
    if (this.editable.upgradePrice.gt(0)) {
      const job = new Job();
      job.design = this;
      job.newDesign = this.editable;
      job.total = this.editable.upgradePrice;
      Shipyard.getInstance().jobs.push(job);
      this.isUpgrading = true;
    } else {
      this.upgrade(this.editable);
    }
    return true;
  }
  generateBuyAction() {
    this.buyAction = new Action(
      "Q",
      new MultiPrice([
        new Price(
          FleetManager.getInstance().freeNavalCapacity,
          this.type.navalCapacity,
          1
        )
      ])
    );
    this.buyAction.showNum = false;
    this.buyAction.afterBuy = (number: Decimal) => {
      const job = new Job();
      job.total = this.price.times(number);
      job.design = this;
      job.quantity = number;
      Shipyard.getInstance().jobs.push(job);
    };
    this.buyAction.reload();
  }
  getShipData(): ShipData {
    const shipData = new ShipData();
    shipData.id = this.id;
    shipData.quantity = this.quantity;
    shipData.totalArmor = this.totalArmor;
    shipData.totalShield = this.totalShield;
    shipData.explosionLevel = this.explosionChance;
    shipData.modules = new Array<{
      computedDamage: Decimal
      shieldPercent: number
      armorPercent: number
    }>();

    this.modules.forEach(m => {
      const weapon = {
        computedDamage: m.computedDamage,
        shieldPercent: m.module.shieldPercent,
        armorPercent: m.module.armorPercent
      };
      shipData.modules.push(weapon);
    });
    return shipData;
  }
  /**
   * Upgrade to a new Design
   */
  upgrade(newDesign: ShipDesign) {
    //  newDesign should be always true
    this.modules = newDesign.modules;
    this.name = newDesign.name;
    this.isUpgrading = false;

    this.reload();
  }
  isBuildingCheck() {
    this.isBuilding = Shipyard.getInstance()
      .getTotalShips(this)
      .gt(0);
  }
}

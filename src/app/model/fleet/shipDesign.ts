import { ShipType, ShipTypes } from "./shipTypes";
import { ISalvable } from "../base/ISalvable";
import { DesignLine } from "./designLine";
import { Action } from "../actions/abstractAction";
import { IBuyable } from "../base/IBuyable";
import { BuyAction } from "../actions/buyAction";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";
import { ResourceManager } from "../resource/resourceManager";
import { FleetManager } from "./fleetManager";

const MODULE_PRICE_INCREASE = 1.1;

export class ShipDesign implements ISalvable, IBuyable {
  id: string;
  type: ShipType;
  name = "";
  shipQuantity = new Decimal(0);

  modules = new Array<DesignLine>();

  totalDamage: Decimal;
  totalArmor: Decimal;
  totalShield: Decimal;
  totalEnergy: Decimal;
  armorDamage: Decimal;
  shieldDamage: Decimal;
  price: Decimal;

  editable: ShipDesign;
  original: ShipDesign;
  usedModulePoint = 0;
  isValid = true;

  buyAction: Action;
  actions = new Array<Action>();
  quantity = new Decimal();
  isLimited = false;
  limit = new Decimal();
  isCapped = false;
  upgradePrice = new Decimal();

  reload() {
    this.totalDamage = new Decimal(0);
    this.totalShield = new Decimal(0);
    this.totalEnergy = new Decimal(0);
    this.armorDamage = new Decimal(0);
    this.shieldDamage = new Decimal(0);
    this.totalArmor = new Decimal(this.type ? this.type.health : 0);
    this.usedModulePoint = 0;
    this.price = new Decimal(this.type.baseCost);

    this.modules
      .filter(q => q.isValid())
      .forEach(w => {
        const multiPrice = w.level * Math.pow(MODULE_PRICE_INCREASE, w.level);
        const bonus = w.level;

        this.totalDamage = this.totalDamage.plus(
          w.module.damage
            .times(bonus)
            .times(w.size)
            .times(w.quantity)
        );
        this.totalEnergy = this.totalEnergy.plus(
          w.module.energyBalance
            .times(bonus)
            .times(w.size)
            .times(w.quantity)
        );
        this.totalArmor = this.totalArmor.plus(
          w.module.armor
            .times(bonus)
            .times(w.size)
            .times(w.quantity)
        );
        this.totalShield = this.totalShield.plus(
          w.module.shield
            .times(bonus)
            .times(w.size)
            .times(w.quantity)
        );
        this.usedModulePoint += w.quantity * w.size;

        this.armorDamage = this.armorDamage.plus(
          w.module.damage
            .times(bonus)
            .times(w.size)
            .times(w.quantity)
            .times(w.module.armorPercent / 100)
        );
        this.shieldDamage = this.shieldDamage.plus(
          w.module.damage
            .times(bonus)
            .times(w.size)
            .times(w.quantity)
            .times(w.module.shieldPercent / 100)
        );
        this.price = this.price.plus(
          w.module.alloyPrice
            .times(w.size)
            .times(w.quantity)
            .times(multiPrice)
        );
      });

    this.isValid =
      this.totalEnergy.gte(0) &&
      this.usedModulePoint <= this.type.modulePoint &&
      this.modules.length <= this.type.moduleCount;

    this.upgradePrice = this.original
      ? this.price
          .minus(this.original.price)
          .max(0)
          .times(this.original.quantity)
      : new Decimal();

    this.generateBuyAction();
  }
  getSave(): any {
    const data: any = {};
    data.i = this.id;
    if (!this.shipQuantity.eq(0)) data.q = this.shipQuantity;
    data.t = this.type.id;
    data.n = this.name;
    data.m = this.modules.map(m => m.getSave());
    if (this.quantity.gt(0)) data.q = this.quantity;

    return data;
  }
  load(data: any): boolean {
    this.id = data.i;
    if ("q" in data) this.shipQuantity = Decimal.fromDecimal(data.q);
    this.type = ShipTypes.find(t => t.id === data.t);
    this.name = data.n;
    if ("m" in data) {
      for (const modData of data.m) {
        this.modules.push(DesignLine.CreateFromData(modData));
      }
    }
    if ("q" in data) {
      this.quantity = Decimal.fromDecimal(data.q);
    }

    this.reload();
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
  addModule() {
    this.editable.modules.push(new DesignLine());
    this.editable.reload();
  }
  removeModule(i: number) {
    this.editable.modules.splice(i, 1);
    this.editable.reload();
  }

  saveConfig() {
    const resMan = ResourceManager.getInstance();

    if (
      this.editable &&
      this.editable.isValid &&
      resMan.alloy.quantity.gte(this.editable.upgradePrice)
    ) {
      resMan.alloy.quantity = resMan.alloy.quantity.minus(
        this.editable.upgradePrice
      );
      this.name = this.editable.name;
      this.modules = this.editable.modules;
      this.reload();
    }
  }
  generateBuyAction() {
    this.buyAction = new BuyAction(
      this,
      new MultiPrice([
        new Price(ResourceManager.getInstance().alloy, this.price, 1),
        new Price(
          FleetManager.getInstance().freeNavalCapacity,
          this.type.navalCapacity,
          1
        )
      ])
    );
    this.buyAction.showNum = false;
    this.buyAction.reload();
  }
}

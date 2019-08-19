import { AbstractUnlockable } from "../base/AbstractUnlockable";
import { ISpendable, isISpendable } from "../base/ISpendable";
import { Production } from "../production";
import { descriptions } from "../descriptions";
import { IBuyable } from "../base/IBuyable";
import { BuyAction } from "../actions/buyAction";
import { MultiPrice } from "../prices/multiPrice";
import { ResourceManager } from "./resourceManager";
import { Action } from "../actions/abstractAction";
import { RefundAction } from "../actions/refundAction";
import { Price } from "../prices/price";
import { IHasQuantity } from "../base/IHasQuantity";
import { BonusStack } from "../bonus/bonusStack";
import { IAlert } from "../base/IAlert";
import { SkillEffect } from "../prestige/skillEffects";
import { PLUS_ADD } from "../prestige/allSkillEffects";
import { ModStack, MOD_MORE } from "../mod/modStack";
import { IResource } from "../base/iResource";
import { Automator } from "../automators/automator";
import { MyFromDecimal } from "../utility/myUtility";

export class Resource extends AbstractUnlockable
  implements ISpendable, IBuyable, IResource {
  constructor(public id: string) {
    super();
    this.name = descriptions.resources[id][0];
    this.description = descriptions.resources[id][1];
  }
  name: string;
  description: string;
  shape: string;

  unlocked = false;
  quantity = new Decimal(0);
  operativity = 100;
  c = new Decimal(0);
  private lastC = new Decimal(0);
  endIn: number = Number.POSITIVE_INFINITY;
  isEnding = false;
  isNew = false;
  actions = new Array<Action>();
  unlockedActions = new Array<Action>();

  products = new Array<Production>();
  generators = new Array<Production>();
  buyAction: BuyAction;
  refundAction: RefundAction;

  isLimited = false;
  isCapped = false;
  fullIn: number = Number.POSITIVE_INFINITY;
  limit = new Decimal(Number.POSITIVE_INFINITY);
  limitStorage: IHasQuantity;
  workerPerMine = new Decimal(10);
  prestigeLimit: SkillEffect;
  prestigeLimitIncrease: number;

  productionMultiplier = new BonusStack();
  priority = 50;
  realPriority = new Decimal();
  showPriority = false;

  alerts: IAlert[];
  modStack: ModStack;
  standardPrice = new Decimal(1);
  exponentialStorage = false;
  alwaysActive = false;
  automators = new Array<Automator>();
  unlockedAutomators = new Array<Automator>();
  automators2 = new Array<Automator>();
  unlockedAutomators2 = new Array<Automator>();
  automation1Name = "Drone Automation";
  automation2Name = "Expansion Automation";
  modPrestige: SkillEffect;

  addGenerator(generator: Resource, ratio: DecimalSource = 1): void {
    const prod = new Production(generator, this, ratio);
    this.generators.push(prod);
    generator.products.push(prod);
  }
  isActive(): boolean {
    return (
      this.unlocked &&
      this.operativity > Number.EPSILON &&
      this.quantity.gt(0) &&
      !this.products.find(
        p => !p.product.alwaysActive && p.product.isCapped && p.ratio.gt(0)
      )
    );
  }

  generateBuyAction(multiPrice: MultiPrice) {
    this.buyAction = new BuyAction(this, multiPrice);
    this.actions.push(this.buyAction);
    this.buyAction.name = "Buy " + this.name;
  }
  generateRefundActions() {
    this.actions.forEach(a => {
      if (
        a instanceof Action &&
        a.multiPrice.prices.findIndex(
          p => p.spendable === ResourceManager.getInstance().habitableSpace
        ) > -1
      ) {
        const toRefund = a instanceof BuyAction ? a.buyable : a;
        if (isISpendable(toRefund)) {
          this.refundAction = new RefundAction(
            "ref",
            new MultiPrice([new Price(toRefund, 1, 1)])
          );

          this.refundAction.actionToRefund = a;
          const price = a.multiPrice.prices.find(
            p => p.spendable === ResourceManager.getInstance().habitableSpace
          );
          this.refundAction.growRate = price.growRate;
          this.refundAction.basePrice = price.cost;
          this.refundAction.name = "Refund " + a.name.replace("Buy ", "");
          this.actions.push(this.refundAction);
        }
      }
    });
  }
  reloadProd() {
    if (this.operativity > 0) {
      const bonusAll = this.productionMultiplier.getTotalBonus();
      const bonusPos = this.productionMultiplier.getTotalBonus(true);

      this.products.forEach(prod => {
        const positive = prod.ratio.gt(0);
        prod.prodPerSec = prod.ratio.times(positive ? bonusAll : bonusPos);

        if (prod.productionMultiplier) {
          const bonus3 = prod.productionMultiplier.getTotalBonus(!positive);
          prod.prodPerSec = prod.prodPerSec.times(bonus3);
        }

        //  Operativity
        prod.prodPerSec = prod.prodPerSec.times(this.operativity / 100);
      });
    } else {
      //  Inactive
      this.products.forEach(prod => {
        prod.prodPerSec = new Decimal(0);
      });
    }
    this.isCapped = this.isLimited && this.quantity.gte(this.limit.floor());
  }
  reloadLimit() {
    if (this.isLimited) {
      let worker = this.workerPerMine;
      if (this.prestigeLimit) {
        const toAdd = this.prestigeLimitIncrease
          ? this.prestigeLimitIncrease
          : PLUS_ADD;
        worker = worker.plus(this.prestigeLimit.numOwned * toAdd);
      }
      this.limit = this.exponentialStorage
        ? this.workerPerMine.times(Decimal.pow(2, this.limitStorage.quantity))
        : this.limitStorage.quantity.plus(1).times(worker);

      if (this.modStack && this.modStack.moreDrones) {
        const modBonus = this.modStack.moreDrones.quantity
          .times(MOD_MORE)
          .plus(1);
        // console.log(modBonus.toNumber());
        this.limit = this.limit.times(modBonus);
      }
      this.limit = this.reloadCustomLimit(this.limit);
      this.limit = this.limit.floor();
      this.quantity = this.quantity.min(this.limit);
    }
  }
  reloadCustomLimit(limit: Decimal): Decimal {
    return limit;
  }
  unlock(): boolean {
    if (super.unlock()) {
      ResourceManager.getInstance().reloadList();
      this.operativity = 100;
      this.isNew = true;
      return true;
    }
    return false;
  }

  setABC() {
    if (this.lastC.eq(this.c)) {
      this.c = this.lastC;
    } else {
      this.lastC = this.c;
    }
  }
  reset(): void {
    super.reset();
    this.quantity = new Decimal(0);
    this.c = new Decimal(0);
  }
  saveMods() {
    this.modStack.save();
    this.quantity = new Decimal(1);
    if (this.buyAction) this.buyAction.quantity = new Decimal(0);
    this.isCapped = this.isLimited && this.quantity.gte(this.limit.floor());
  }
  getQuantity(): Decimal {
    return this.quantity;
  }
  //#region Save and Load
  getSave(): any {
    const data = super.getSave();
    if (this.unlockedActions.length > 0) {
      data.a = this.unlockedActions.map(a => a.getSave());
    }
    if (!this.quantity.eq(0)) data.q = this.quantity;
    if (this.operativity !== 100) data.o = this.operativity;
    if (this.modStack) data.m = this.modStack.getSave();
    data.rp = this.priority;
    return data;
  }
  load(data: any): boolean {
    if (!super.load(data)) return false;
    if ("q" in data) this.quantity = MyFromDecimal(data.q);
    if ("a" in data) {
      for (const actData of data.a) {
        if ("i" in actData) {
          const act = this.actions.find(a => a.id === actData.i);
          if (act) act.load(actData);
        }
      }
    }
    if ("o" in data) this.operativity = Math.min(data.o, 100);
    if ("m" in data) this.modStack.load(data.m);
    if ("rp" in data) this.priority = data.rp;

    this.unlockedActions = this.actions.filter(a => a.unlocked);
    return true;
  }
  //#endregion
}

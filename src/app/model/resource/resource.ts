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
import { ResearchManager } from "../research/researchManager";

export class Resource extends AbstractUnlockable
  implements ISpendable, IBuyable {
  name: string;
  description: string;
  shape: string;

  unlocked = false;
  quantity = new Decimal(0);
  operativity = 100;
  a = new Decimal(0);
  b = new Decimal(0);
  c = new Decimal(0);
  private lastA = new Decimal(0);
  private lastB = new Decimal(0);
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
  efficiencyMultiplier = new BonusStack();

  alerts: IAlert[];

  constructor(public id: string) {
    super();
    this.name = descriptions.resources[id][0];
    this.description = descriptions.resources[id][1];
  }

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
      !this.products.find(p => p.product.isCapped && p.ratio.gt(0))
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
          this.refundAction.name = "Refund " + a.name.replace("Buy ", "");
          this.actions.push(this.refundAction);
        }
      }
    });
  }
  reloadProd() {
    if (this.operativity > 0) {
      const prodAdd = this.productionMultiplier.getAdditiveBonus();
      const prodMulti = this.productionMultiplier.getMultiplicativeBonus();
      const effAdd = this.efficiencyMultiplier.getAdditiveBonus();
      const effMulti = this.efficiencyMultiplier.getMultiplicativeBonus();

      this.products.forEach(prod => {
        const positive = prod.ratio.gt(0);
        prod.prodPerSec = prod.ratio.plus(prodAdd.times(positive ? 1 : -1));
        if (positive) prod.prodPerSec = prod.prodPerSec.plus(effAdd);
        const totalMulti = prodMulti.times(positive ? effMulti : 1);
        prod.prodPerSec = prod.prodPerSec.times(totalMulti);

        //  Operativity
        prod.prodPerSec = prod.prodPerSec.times(this.operativity / 100);
      });
    } else {
      //  Inactive
      this.products.forEach(prod => {
        prod.prodPerSec = new Decimal(0);
      });
    }
    this.isCapped = this.isLimited && this.quantity.gte(this.limit);
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
      this.limit = this.limitStorage.quantity.plus(1).times(worker);

      //  Energy
      if (this.id === "e" && ResearchManager.getInstance()) {
        this.limit = this.limit.times(
          new Decimal(1).plus(
            ResearchManager.getInstance()
              .battery.quantity.minus(1)
              .times(0.1)
          )
        );
      }

      this.quantity = this.quantity.min(this.limit);
    }
  }
  unlock(): boolean {
    if (super.unlock()) {
      ResourceManager.getInstance().reloadList();
      this.operativity = 100;
      return true;
    }
    return false;
  }

  setABC() {
    if (this.lastA.eq(this.a)) {
      this.a = this.lastA;
    } else {
      this.lastA = this.a;
    }

    if (this.lastB.eq(this.b)) {
      this.b = this.lastB;
    } else {
      this.lastB = this.b;
    }

    if (this.lastC.eq(this.c)) {
      this.c = this.lastC;
    } else {
      this.lastC = this.c;
    }
  }
  reset(): void {
    super.reset();
    this.quantity = new Decimal(0);
    this.a = new Decimal(0);
    this.b = new Decimal(0);
    this.c = new Decimal(0);
  }
  //#region Save and Load
  getSave(): any {
    const data = super.getSave();
    if (!this.quantity.eq(0)) data.q = this.quantity;
    if (this.unlockedActions.length > 0) {
      data.a = this.unlockedActions.map(a => a.getSave());
    }
    if (this.operativity !== 100) data.o = this.operativity;
    return data;
  }
  load(data: any): boolean {
    if (!super.load(data)) return false;
    if ("q" in data) this.quantity = Decimal.fromDecimal(data.q);
    if ("a" in data) {
      for (const actData of data.a) {
        if ("i" in actData) {
          const act = this.actions.find(a => a.id === actData.i);
          if (act) act.load(actData);
        }
      }
    }
    if ("o" in data) this.operativity = data.o;

    this.unlockedActions = this.actions.filter(a => a.unlocked);
    return true;
  }
  //#endregion
}

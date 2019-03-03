import { AbstractUnlockable } from "../base/AbstractUnlockable";
import { ISpendable } from "../base/ISpendable";
import { Production } from "../production";
import { descriptions } from "../descriptions";
import { IBuyable } from "../base/IBuyable";
import { BuyAction } from "../actions/buyAction";
import { MultiPrice } from "../prices/multiPrice";
import { Multiplier } from "../base/multiplier";
import { ResourceManager } from "./resourceManager";
import { AbstractAction } from "../actions/abstractAction";
import { RefundAction } from "../actions/refundAction";
import { Price } from "../prices/price";

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
  actions = new Array<AbstractAction>();

  products = new Array<Production>();
  generators = new Array<Production>();
  buyAction: BuyAction;
  refundAction: RefundAction;

  efficiencyMulti = new Array<Multiplier>();

  isLimited = false;
  isCapped = false;
  fullIn: number = Number.POSITIVE_INFINITY;
  limit = new Decimal(Number.POSITIVE_INFINITY);
  limitStorage: Resource;
  workerPerMine = new Decimal(10);

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
      this.unlocked && this.operativity > Number.EPSILON && this.quantity.gt(0)
    );
  }
  /**
   * Generate Buy Action and Refund Action
   */
  generateBuyAction(multiPrice: MultiPrice) {
    this.buyAction = new BuyAction(this, multiPrice);
    this.actions.push(this.buyAction);
    this.buyAction.name = "Buy " + this.name;
  }
  generateRefundActions() {
    this.actions.forEach(a => {
      if (
        a instanceof BuyAction &&
        a.multiPrice.prices.findIndex(
          p => p.spendable === ResourceManager.getInstance().habitableSpace
        ) > -1
      ) {
        this.refundAction = new RefundAction(
          "ref",
          new MultiPrice([new Price(a.buyable, 1, 1)])
        );
        this.refundAction.actionToRefund = a;
        this.refundAction.name = "Refund " + a.name.slice(3);
        this.actions.push(this.refundAction);
      }
    });
  }
  reloadProd() {
    if (this.operativity > 0) {
      let prodMulti = new Decimal(1);
      this.efficiencyMulti.forEach(eff => {
        prodMulti = prodMulti.plus(eff.getBonus());
      });

      this.products.forEach(prod => {
        prod.prodPerSec = prod.ratio.times(prodMulti);
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
      this.limit = this.limitStorage.quantity.plus(1).times(this.workerPerMine);
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
  getSave(): any {
    const data = super.getSave();
    if (!this.quantity.eq(0)) data.q = this.quantity;
    if (this.actions.findIndex(act => act.unlocked) > -1) {
      data.a = this.actions.filter(a => a.unlocked).map(a => a.getSave());
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
          const act = this.actions.find(a => a.id === actData.id);
          if (act) act.load(actData);
        }
      }
    }
    if ("o" in data) this.operativity = data.o;

    return true;
  }
}

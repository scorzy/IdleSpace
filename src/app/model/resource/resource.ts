import { AbstractUnlockable } from "../base/AbstractUnlockable";
import { ISpendable } from "../base/ISpendable";
import { Production } from "../production";
import { descriptions } from "../descriptions";
import { IBuyable } from "../base/IBuyable";
import { BuyAction } from "../actions/buyAction";
import { MultiPrice } from "../prices/multiPrice";
import { Multiplier } from "../base/multiplier";

export class Resource extends AbstractUnlockable
  implements ISpendable, IBuyable {
  name: string;
  description: string;

  unlocked = false;
  quantity = new Decimal(0);
  operativity = 1;
  a = new Decimal(0);
  b = new Decimal(0);
  c = new Decimal(0);
  endIn: number = Number.POSITIVE_INFINITY;
  isEnding = false;
  isNew = false;
  actions = new Array<BuyAction>();

  products = new Array<Production>();
  generators = new Array<Production>();
  buyAction: BuyAction;

  efficiencyMulti = new Array<Multiplier>();

  isLimited = false;
  isCapped = false;
  fullIn: number = Number.POSITIVE_INFINITY;
  limit = new Decimal(Number.POSITIVE_INFINITY);
  limitMine: Resource;
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
  generateBuyAction(multiPrice: MultiPrice) {
    this.buyAction = new BuyAction(this, multiPrice);
    this.actions.push(this.buyAction);
  }
  reloadProd() {
    let prodMulti = new Decimal(1);
    this.efficiencyMulti.forEach(eff => {
      prodMulti = prodMulti.plus(eff.getBonus());
    });

    this.products.forEach(prod => {
      prod.prodPerSec = prod.ratio.times(prodMulti);
    });

    this.isCapped = this.isLimited && this.quantity.gte(this.limit);
  }
  reloadLimit() {
    if (this.isLimited) {
      this.limit = this.limitMine.quantity.times(this.workerPerMine);
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
    return data;
  }
  load(data: any): boolean {
    if (!super.load(data)) return false;
    this.quantity = new Decimal("q" in data ? data.q : 0);
    if ("a" in data) {
      for (const actData of data.a) {
        if ("i" in actData) {
          const act = this.actions.find(a => a.id === actData.id);
          if (act) act.load(actData);
        }
      }
    }
    return true;
  }
}

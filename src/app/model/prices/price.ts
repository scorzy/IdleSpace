import { ISpendable } from "../base/ISpendable";
import { solveEquation } from "ant-utils";

export class Price {
  canBuy = false;
  maxBuy = new Decimal(0);
  cost = new Decimal(0);
  avIn = new Decimal(Number.POSITIVE_INFINITY);
  multiCost = new Decimal(0);
  canBuyMulti = false;

  constructor(
    public spendable: ISpendable,
    cost: DecimalSource,
    public growRate = 1.1
  ) {
    this.cost = new Decimal(cost);
  }

  reload(bought: Decimal, numWanted: Decimal = new Decimal(1)) {
    if (this.spendable.quantity.lte(0)) {
      this.maxBuy = new Decimal(0);
      this.canBuy = false;
      this.canBuyMulti = false;
      return;
    }
    this.maxBuy =
      this.growRate === 1
        ? this.spendable.quantity.div(this.cost).floor()
        : (this.maxBuy = Decimal.affordGeometricSeries(
            this.spendable.quantity,
            this.cost,
            this.growRate,
            bought
          ));

    this.canBuy = this.maxBuy.gte(1);

    this.multiCost = this.getPrice(numWanted, bought);
    this.canBuyMulti = this.multiCost.lte(this.spendable.quantity);
  }
  buy(toBuy: Decimal, bought: Decimal): boolean {
    const price = this.getPrice(toBuy, bought);
    if (price.gt(this.spendable.quantity)) return false;

    this.spendable.quantity = this.spendable.quantity.minus(price);
    return true;
  }
  getTime(): Decimal {
    if (this.cost.lte(this.spendable.quantity)) return new Decimal(0);
    else {
      this.avIn = solveEquation(
        this.spendable.a,
        this.spendable.b,
        this.spendable.c,
        this.spendable.quantity.minus(this.cost)
      )
        .filter(s => s.gte(0))
        .reduce((p, c) => p.min(c), new Decimal(Number.POSITIVE_INFINITY));
      return this.avIn;
    }
  }
  private getPrice(toBuy: Decimal, bought: Decimal): Decimal {
    return this.growRate === 1
      ? toBuy.times(this.cost)
      : Decimal.sumGeometricSeries(toBuy, this.cost, this.growRate, bought);
  }
}

import { ISpendable } from "../base/ISpendable";

export class Price {
  canBuy = false;
  maxBuy = new Decimal(0);
  cost = new Decimal(0);

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
    if (numWanted) {
      this.multiCost = this.getPrice(numWanted, bought);
      this.canBuyMulti = this.multiCost.gte(this.spendable.quantity);
    }
  }
  buy(toBuy: Decimal, bought: Decimal): boolean {
    const price = this.getPrice(toBuy, bought);
    if (price.gt(this.spendable.quantity)) return false;

    this.spendable.quantity = this.spendable.quantity.minus(price);
    return true;
  }

  private getPrice(toBuy: Decimal, bought: Decimal): Decimal {
    return this.growRate === 1
      ? toBuy.times(this.cost)
      : Decimal.sumGeometricSeries(toBuy, this.cost, this.growRate, bought);
  }
}

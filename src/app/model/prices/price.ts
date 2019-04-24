import { ISpendable } from "../base/ISpendable";

export class Price {
  canBuy = false;
  maxBuy = new Decimal(0);
  cost = new Decimal(0);
  avIn = new Decimal(Number.POSITIVE_INFINITY);
  multiCost = new Decimal(0);
  singleCost = new Decimal(0);
  canBuyMulti = false;

  constructor(
    public spendable: ISpendable,
    cost: DecimalSource,
    public growRate = 1.1
  ) {
    this.cost = new Decimal(cost);
  }

  reload(bought: Decimal, numWanted: Decimal = new Decimal(1)) {
    const tempMultiCost = this.getPrice(numWanted, bought);
    if (!tempMultiCost.eq(this.multiCost)) this.multiCost = tempMultiCost;
    this.singleCost = this.getPrice(new Decimal(1), bought);

    if (this.spendable.quantity.lte(0)) {
      this.maxBuy = new Decimal(0);
      this.canBuy = false;
      this.canBuyMulti = false;
      return;
    }
    this.maxBuy =
      this.growRate === 1
        ? this.spendable.quantity.div(this.cost).floor()
        : Decimal.affordGeometricSeries(
            this.spendable.quantity.ceil(),
            this.cost,
            this.growRate,
            bought
          );

    this.canBuy = this.maxBuy.gte(1);
    this.canBuyMulti = this.multiCost.lte(this.spendable.quantity);
  }
  buy(toBuy: Decimal, bought: Decimal): boolean {
    const price = this.getPrice(toBuy, bought);
    if (price.gt(this.spendable.quantity)) return false;

    this.spendable.quantity = this.spendable.quantity.minus(price);
    return true;
  }
  getTime(): Decimal {
    if (this.singleCost.lte(this.spendable.quantity)) return new Decimal(0);
    else {
      this.avIn = this.singleCost.gt(this.spendable.limit)
        ? new Decimal(Number.POSITIVE_INFINITY)
        : this.singleCost
            .minus(this.spendable.quantity)
            .div(this.spendable.c)
            .max(0);
      return this.avIn;
    }
  }
  getPrice(toBuy: Decimal, bought: Decimal): Decimal {
    return this.growRate === 1
      ? toBuy.times(this.cost)
      : Decimal.sumGeometricSeries(toBuy, this.cost, this.growRate, bought);
  }
  /**
   * Get max buy, percentToUse in % 1-100
   */
  getMaxBuy(bought: Decimal, percentToUse: number): Decimal {
    if (this.spendable.quantity.lte(0)) {
      return new Decimal(0);
    }
    if (this.spendable.id === "md" || this.spendable.id === "cd") {
      percentToUse = 100;
    }
    const resourceToUse = this.spendable.quantity.times(percentToUse / 100);
    return this.growRate === 1
      ? resourceToUse.div(this.cost).floor()
      : (this.maxBuy = Decimal.affordGeometricSeries(
          resourceToUse,
          this.cost,
          this.growRate,
          bought
        ));
  }
}

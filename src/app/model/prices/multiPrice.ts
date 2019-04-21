import { Price } from "./price";

export class MultiPrice {
  canBuy = false;
  maxBuy = new Decimal(0);

  canBuyWanted = false;
  availableIn = Number.POSITIVE_INFINITY;

  constructor(public prices: Price[]) {}
  reload(bought: Decimal, numWanted = new Decimal(1)) {
    this.canBuy = true;
    this.canBuyWanted = true;
    numWanted = new Decimal(numWanted).max(1);
    this.prices.forEach(pr => {
      pr.reload(bought, numWanted);
      if (!pr.canBuy) this.canBuy = false;
      if (!pr.canBuyMulti) this.canBuyWanted = false;
    });
    this.maxBuy = this.canBuy
      ? this.prices
          .map(p => p.maxBuy)
          .reduce((p, c) => p.min(c), new Decimal(Number.POSITIVE_INFINITY))
      : new Decimal(0);
    this.reloadAvailableTime();
  }
  buy(quantity: Decimal, bought: Decimal): boolean {
    this.reload(bought, quantity);
    if (!this.canBuy) return false;
    this.prices.forEach(pr => pr.buy(quantity, bought));
    this.reload(bought.plus(quantity), quantity);
    return true;
  }
  reloadAvailableTime() {
    this.availableIn =
      this.prices
        .map(p => p.getTime())
        .reduce((p, c) => p.max(c), new Decimal(0))
        .toNumber() * 1000;
  }
  getMaxBuy(bought: Decimal, percentToUse: number): Decimal {
    return this.prices
      .map(pr => pr.getMaxBuy(bought, percentToUse))
      .reduce((p, c) => p.min(c), new Decimal(Number.POSITIVE_INFINITY));
  }
}

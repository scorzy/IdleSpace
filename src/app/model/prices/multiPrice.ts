import { Price } from "./price";

export class MultiPrice {
  canBuy = false;
  maxBuy = new Decimal(0);

  numWanted = new Decimal(1);
  canBuyWanted = false;

  constructor(public prices: Price[], public growRate: number) {}
  reload(bought: Decimal) {
    this.canBuy = true;
    this.canBuyWanted = true;
    this.prices.forEach(pr => {
      pr.reload(bought, this.numWanted);
      if (!pr.canBuy) this.canBuy = false;
      if (!pr.canBuyMulti) this.canBuyWanted = false;
    });
  }
  buy(quantity: Decimal, bought: Decimal): boolean {
    this.reload(bought);
    if (!this.canBuy) return false;
    this.prices.forEach(pr => pr.buy(quantity, bought));
    this.reload(bought.plus(quantity));
  }
}

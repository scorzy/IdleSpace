import { Action } from "./abstractAction";

import { MultiPrice } from "../prices/multiPrice";
import { IBuyable } from "../base/IBuyable";

export class BuyAction extends Action {
  constructor(public buyable: IBuyable, multiPrice: MultiPrice) {
    super("B", multiPrice);
    this.name = "Buy";
    this.showTime = true;
  }

  buy(number: Decimal): boolean {
    if (this.buyable.isLimited) {
      if (this.buyable.isCapped) return false;
      number = Decimal.min(
        number,
        this.buyable.limit.minus(this.buyable.quantity)
      );
    }
    return super.buy(number);
  }

  onBuy(number: Decimal): boolean {
    this.buyable.quantity = this.buyable.quantity.plus(number);
    if (this.buyable.isLimited) {
      this.buyable.isCapped = this.buyable.quantity.gte(this.buyable.limit);
    }

    return true;
  }

  reload() {
    this.quantity = Decimal.min(this.quantity, this.buyable.quantity);

    if (this.buyable.isCapped) {
      super.reload();
      this.canBuy = false;
      this.canBuyWanted = false;
      this.availableIn = Number.POSITIVE_INFINITY;
      this.maxBuy = new Decimal(0);
      return;
    }

    if (this.buyable.isLimited) {
      const max = this.buyable.limit.minus(this.buyable.quantity);
      if (this.numWanted.gt(max)) this.numWanted = max;
      super.reload();
      this.maxBuy = this.maxBuy.min(max);
      return;
    }

    super.reload();
  }
  isCapped(): boolean {
    return this.buyable.isCapped;
  }
}

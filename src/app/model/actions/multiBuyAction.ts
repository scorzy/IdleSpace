import { Action } from "./abstractAction";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";
import { BuyAction } from "./buyAction";
import { ZERO_DECIMAL_IMMUTABLE } from "../game";

/**
 * Multiple Action aggregation
 * Prices must have the same grow rate
 */
export class MultiBuyAction extends Action {
  constructor(public actions: Action[]) {
    super("", new MultiPrice([]));
    this.showNum = false;
    this.id = "";
    this.actions.forEach(a => {
      this.id += "-" + a.id;
    });
    this.init();
  }

  init() {
    this.multiPrice.prices.forEach(p => {
      p.cost = ZERO_DECIMAL_IMMUTABLE;
    });
    this.actions.forEach(a => {
      a.multiPrice.prices.forEach(p => {
        let price = this.multiPrice.prices.find(
          k => k.spendable === p.spendable
        );
        if (!price) {
          price = new Price(p.spendable, new Decimal(0), p.growRate);
          this.multiPrice.prices.push(price);
        }
        price.cost = price.cost.plus(p.getPrice(new Decimal(1), a.quantity));
      });
    });
  }

  onBuy(number: Decimal): boolean {
    this.actions.forEach(a => {
      a.quantity = a.quantity.plus(number);
      a.onBuy(number);
    });
    return true;
  }
  afterBuy(number: Decimal) {
    this.actions.forEach(a => a.afterBuy(number));
  }
  reload() {
    this.init();
    if (this.isCapped()) {
      super.reload();
      this.canBuy = false;
      this.canBuyWanted = false;
      this.availableIn = Number.POSITIVE_INFINITY;
      this.maxBuy = new Decimal(0);
      return;
    }
    super.reload();
    this.actions
      .filter(a => a instanceof BuyAction && a.buyable.isLimited)
      .forEach(a => {
        if (a instanceof BuyAction) {
          const max = a.buyable.limit.minus(a.buyable.quantity);
          if (this.numWanted.gt(max)) this.numWanted = max;
          this.maxBuy = this.maxBuy.min(max);
        }
      });
  }
  isCapped(): boolean {
    return (
      this.actions.findIndex(
        a => a instanceof BuyAction && a.buyable.isCapped
      ) > -1
    );
  }
}

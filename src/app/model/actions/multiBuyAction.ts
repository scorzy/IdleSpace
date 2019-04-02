import { Action } from "./abstractAction";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";

/**
 * Multiple Action aggregation
 * Prices must have the same grow rate
 */
export class MultiBuyAction extends Action {
  constructor(public actions: Action[]) {
    super("", new MultiPrice([]));
    this.id = "";
    this.actions.forEach(a => {
      this.id += "-" + a.id;
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
    this.actions.forEach(a => a.onBuy(number));
    return true;
  }
  afterBuy(number: Decimal) {
    this.actions.forEach(a => a.afterBuy(number));
  }
}

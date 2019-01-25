import { AbstractAction } from "./abstractAction";
import { MultiPrice } from "../prices/multiPrice";
import { IBuyable } from "../base/IBuyable";

export class BuyAction extends AbstractAction {
  constructor(public buyable: IBuyable, multiPrice: MultiPrice) {
    super("B", multiPrice);
  }

  onBuy(number: Decimal): boolean {
    this.buyable.quantity = this.buyable.quantity.plus(number);
    return true;
  }
}

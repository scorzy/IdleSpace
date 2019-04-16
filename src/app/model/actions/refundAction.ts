import { Action } from "./abstractAction";
import { ResourceManager } from "../resource/resourceManager";

export class RefundAction extends Action {
  alertMessage =
    "Habitable space will be refunded, other resource will be lost. Continue?";
  showTime = false;
  showNum = false;
  actionToRefund: Action;
  growRate = 1.1;
  basePrice = new Decimal(1);

  onBuy(number: Decimal): boolean {
    const owned =
      this.actionToRefund !== this.multiPrice.prices[0].spendable
        ? this.actionToRefund.quantity.minus(number)
        : this.actionToRefund.quantity;
    const toRefund = Decimal.sumGeometricSeries(
      number,
      this.basePrice,
      this.growRate,
      owned
    );
    // console.log(toRefund.toNumber());
    // console.log(owned.toNumber());

    ResourceManager.getInstance().habitableSpace.quantity = ResourceManager.getInstance().habitableSpace.quantity.plus(
      toRefund
    );
    if (this.actionToRefund !== this.multiPrice.prices[0].spendable) {
      this.actionToRefund.quantity = this.actionToRefund.quantity.minus(number);
    }

    this.actionToRefund.afterBuy(number.times(-1));
    this.actionToRefund.reload();
    return true;
  }
}

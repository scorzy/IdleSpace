import { Action } from "./abstractAction";
import { ResourceManager } from "../resource/resourceManager";

export class RefundAction extends Action {
  alertMessage =
    "Habitable space will be refunded, other resource will be lost. Continue?";
  showTime = false;
  showNum = false;
  actionToRefund: Action;

  onBuy(number: Decimal): boolean {
    ResourceManager.getInstance().habitableSpace.quantity = ResourceManager.getInstance().habitableSpace.quantity.plus(
      number
    );
    if (this.actionToRefund !== this.multiPrice.prices[0].spendable) {
      this.actionToRefund.quantity = this.actionToRefund.quantity.minus(number);
    }

    this.actionToRefund.afterBuy(number.times(-1));
    this.actionToRefund.reload();
    return true;
  }
}

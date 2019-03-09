import { AbstractAction } from "./abstractAction";
import { ResourceManager } from "../resource/resourceManager";

export class RefundAction extends AbstractAction {
  alertMessage =
    "Habitable space will be refund, other resource will be lost. Continue?";
  showTime = false;
  actionToRefund: AbstractAction;

  onBuy(number: Decimal): boolean {
    ResourceManager.getInstance().habitableSpace.quantity = ResourceManager.getInstance().habitableSpace.quantity.plus(
      number
    );
    this.actionToRefund.quantity = this.actionToRefund.quantity.minus(number);
    this.actionToRefund.afterBuy(number.times(-1));
    this.actionToRefund.reload();
    return true;
  }
}

import { MultiPrice } from "../prices/multiPrice";
import { AbstractUnlockable } from "../base/AbstractUnlockable";

export abstract class AbstractAction extends AbstractUnlockable {
  quantity = new Decimal(0);
  unlocked = false;

  constructor(id: string, public multiPrice: MultiPrice) {
    super();
    this.id = id;
  }

  buy(number: Decimal) {
    this.multiPrice.numWanted = number;
    this.multiPrice.reload(this.quantity);
    if (this.multiPrice.canBuyWanted) {
      if (this.multiPrice.buy(number, this.quantity)) {
        this.quantity = this.quantity.plus(number);
        this.onBuy(number);
      }
    }
  }
  abstract onBuy(number: Decimal): boolean;
  unlock(): boolean {
    this.unlocked = true;
    return this.unlocked;
  }
  save(): any {
    const data = super.getSave();

    return data;
  }
  load(data: any): boolean {
    if (super.load(data)) {
      this.unlocked = true;
      if ("q" in data) this.quantity = new Decimal(data.q);
      return true;
    }
    return false;
  }
}

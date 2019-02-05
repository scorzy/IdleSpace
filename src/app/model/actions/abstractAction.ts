import { MultiPrice } from "../prices/multiPrice";
import { AbstractUnlockable } from "../base/AbstractUnlockable";

export abstract class AbstractAction extends AbstractUnlockable {
  quantity = new Decimal(0);
  unlocked = false;
  shape: string;
  onlyOne = false;
  skippable = false;
  showTime = false;
  limit = new Decimal(Number.POSITIVE_INFINITY);
  complete = false;
  canBuy = false;
  canBuyWanted = false;
  availableIn = Number.POSITIVE_INFINITY;
  numWanted = new Decimal(1);
  numWantedUi = 1;
  maxBuy = new Decimal(0);

  constructor(id: string, public multiPrice: MultiPrice) {
    super();
    this.id = id;
  }

  buy(number: Decimal) {
    this.multiPrice.reload(this.quantity, this.numWanted);
    if (this.multiPrice.canBuyWanted) {
      if (this.multiPrice.buy(number, this.quantity)) {
        this.quantity = this.quantity.plus(number);
        this.onBuy(number);
        this.afterBuy(number);

        this.reload();
      }
    }
  }
  abstract onBuy(number: Decimal): boolean;
  afterBuy(number: Decimal) {}

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
  setNumWanted() {
    this.numWanted = new Decimal(this.numWantedUi);
    this.numWanted = this.numWanted.max(0);
  }
  reload() {
    this.multiPrice.reload(this.quantity, this.numWanted);
    this.canBuy = this.multiPrice.canBuy;
    this.canBuyWanted = this.multiPrice.canBuyWanted;
    this.availableIn = this.multiPrice.availableIn;
    this.maxBuy = this.multiPrice.maxBuy;
  }
  isCapped(): boolean {
    return false;
  }
}

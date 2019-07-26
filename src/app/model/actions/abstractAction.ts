import { MultiPrice } from "../prices/multiPrice";
import { AbstractUnlockable } from "../base/AbstractUnlockable";
import { Research } from "../research/research";
import { IHasQuantity } from "../base/IHasQuantity";
import { ISpendable } from "../base/ISpendable";
import { MyFromDecimal } from "../utility/myUtility";

export class Action extends AbstractUnlockable
  implements IHasQuantity, ISpendable {
  quantity = new Decimal(0);
  unlocked = false;
  shape: string;
  onlyOne = false;
  skippable = false;
  showTime = true;
  limit = new Decimal(Number.POSITIVE_INFINITY);
  complete = false;
  canBuy = false;
  canBuyWanted = false;
  availableIn = Number.POSITIVE_INFINITY;
  numWanted = new Decimal(1);
  numWantedUi = 1;
  maxBuy = new Decimal(0);
  showNum = true;
  research: Research;

  alertMessage: string;
  c = new Decimal(0);

  constructor(id: string, public multiPrice: MultiPrice) {
    super();
    this.id = id;
    this.setDefaultUnlocked();
  }

  buy(number: Decimal): boolean {
    this.multiPrice.reload(this.quantity, this.numWanted);
    if (this.multiPrice.maxBuy.gte(number)) {
      if (this.multiPrice.buy(number, this.quantity)) {
        this.quantity = this.quantity.plus(number);
        this.onBuy(number);
        this.afterBuy(number);

        this.reload();
        return true;
      }
    }
    return false;
  }
  onBuy(number: Decimal): boolean {
    return true;
  }
  afterBuy(number: Decimal) {}

  unlock(): boolean {
    this.unlocked = true;
    return this.unlocked;
  }
  getSave(): any {
    const data = super.getSave();
    if (this.showNum && !this.quantity.eq(0)) data.q = this.quantity;

    return data;
  }
  load(data: any): boolean {
    if (super.load(data)) {
      if ("q" in data) this.quantity = MyFromDecimal(data.q);
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
  setResearch(res: Research) {
    this.setDefaultUnlocked(false);
    this.research = res;
    this.research.toUnlock.push(this);
  }
}

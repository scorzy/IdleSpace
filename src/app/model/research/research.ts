import { AbstractUnlockable } from "../base/AbstractUnlockable";
import { IUnlockable } from "../base/IUnlockable";
import { ResearchManager } from "./researchManager";
import { descriptions } from "../descriptions";
import { RomanPipe } from "src/app/roman.pipe";
import { ISpendable } from "../base/ISpendable";

export class Research extends AbstractUnlockable implements ISpendable {
  static romanPipe = new RomanPipe();

  a: Decimal;
  c: Decimal;
  b: Decimal;

  progress = new Decimal(0);
  total = new Decimal(0);
  private cost: Decimal;
  toUnlock = new Array<IUnlockable>();
  completed = false;
  resManager: ResearchManager;
  limit = new Decimal(1);
  quantity = new Decimal(0);
  ratio = 2;

  progressPercent = 0;
  done = false;
  number = "";

  constructor(public id: string, cost: DecimalSource) {
    super();
    this.name = descriptions.researches[id][0];
    this.description = descriptions.researches[id][1];
    this.cost = new Decimal(cost);
    this.total = new Decimal(this.cost);
  }

  addProgress(toAdd: Decimal): Decimal {
    const diff = this.total.minus(this.progress);
    this.progress = Decimal.min(this.progress.plus(toAdd), this.total);
    this.done = false;
    let ret = new Decimal(0);

    if (this.progress.gte(this.total)) {
      ret = diff;
      this.done = true;
      this.toUnlock.forEach(u => u.unlock());
      this.quantity = this.quantity.plus(1);
      this.progress = new Decimal(0);
      if (this.quantity.gte(this.limit)) {
        this.completed = true;
      } else {
        this.total = Decimal.pow(this.ratio, this.quantity).times(this.cost);
        this.number = Research.romanPipe.transform(this.quantity.plus(1));
      }
    }

    this.progressPercent = Math.floor(
      this.progress
        .div(this.total)
        .times(100)
        .toNumber()
    );

    return ret;
  }

  unlock(): boolean {
    if (super.unlock()) {
      this.resManager.addAvailable(this);
      return true;
    }
    return false;
  }

  getSave(): any {
    const save = super.getSave();
    if (this.progress.gt(0)) save.p = this.progress;
    if (this.quantity.gt(0)) save.q = this.quantity;
    return save;
  }
  load(data: any): boolean {
    if (!super.load(data)) return false;
    if ("p" in data) this.progress = Decimal.fromDecimal(data.p);
    if ("q" in data) this.quantity = Decimal.fromDecimal(data.q);

    this.total = Decimal.pow(this.ratio, this.quantity).times(this.cost);
    if (this.quantity.gte(1) && this.limit.gt(1)) {
      this.number = Research.romanPipe.transform(this.quantity.plus(1));
    }
    return true;
  }
}

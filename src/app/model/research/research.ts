import { AbstractUnlockable } from "../base/AbstractUnlockable";
import { IUnlockable } from "../base/IUnlockable";
import { ResearchManager } from "./researchManager";
import { RomanPipe } from "src/app/roman.pipe";
import { IResearchData } from "./iResearchData";
import { IHasQuantity } from "../base/IHasQuantity";
import { IJob } from "../base/IJob";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { IResource } from "../base/iResource";

export class Research extends AbstractUnlockable
  implements IHasQuantity, IResource, IJob {
  private constructor() {
    super();
  }
  static romanPipe = new RomanPipe();

  id: string;

  shape: string;
  progress = new Decimal(0);
  total = new Decimal(0);
  private cost: Decimal;
  toUnlock = new Array<IUnlockable>();
  completed = false;
  limit = new Decimal(1);
  quantity = new Decimal(0);
  ratio = 2;

  progressPercent = 0;
  done = false;
  firstDone = false;
  number = "";

  static fromData(data: IResearchData): Research {
    const ret = new Research();
    ret.id = data.id;
    ret.name = data.name;
    ret.shape = data.shape;
    ret.description = data.description;
    ret.cost = new Decimal(data.price);
    ret.total = new Decimal(ret.cost);
    if (data.limit) ret.limit = new Decimal(data.limit);
    return ret;
  }

  addProgress(toAdd: Decimal): Decimal {
    const diff = this.total.minus(this.progress);
    this.progress = Decimal.min(this.progress.plus(toAdd), this.total);
    this.done = false;
    let ret = new Decimal(0);

    if (this.progress.gte(this.total)) {
      ret = toAdd.minus(diff);
      this.done = true;
      this.firstDone = true;
      this.toUnlock.forEach(u => u.unlock());
      this.quantity = this.quantity.plus(1);
      this.progress = new Decimal(0);
      this.reloadNum();
      this.onBuy();

      //  Notification
      if (OptionsService.researchNotification) {
        MainService.toastr.show("", this.getName(), {}, "toast-research");
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
  reloadNum() {
    if (this.quantity.gte(this.limit)) {
      this.completed = true;
    } else {
      this.total = Decimal.pow(this.ratio, this.quantity).times(this.cost);
      if (this.limit.gt(1)) {
        this.number = Research.romanPipe.transform(this.quantity.plus(1));
      }
    }
  }
  onBuy() {}
  unlock(): boolean {
    if (super.unlock()) {
      ResearchManager.getInstance().addAvailable(this);
      return true;
    }
    return false;
  }

  getQuantity(): Decimal {
    return this.quantity;
  }
  //#region IJob
  getName(): string {
    return this.name + " " + this.number;
  }
  getDescription?(): string {
    return this.description;
  }
  getShape?(): string {
    return this.shape;
  }
  getTotal(): Decimal {
    return this.total;
  }
  getProgress(): Decimal {
    return this.progress;
  }
  getProgressPercent(): number {
    return this.progressPercent;
  }
  //#endregion

  //#region Save and Load
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

    this.firstDone = this.quantity.gte(1);
    this.reloadNum();
    return true;
  }
  //#endregion
}

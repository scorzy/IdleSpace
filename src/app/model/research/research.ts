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
import { Module } from "../fleet/module";
import { ShipType } from "../fleet/shipTypes";
import { Classes, ShipClass } from "../fleet/class";
import { MyFromDecimal } from "../utility/myUtility";

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
  timeToEnd = Number.POSITIVE_INFINITY;
  navalCapacity = 0;
  module: Module;
  ship: ShipType;
  bonus: Array<[string, string]>;
  classes: ShipClass[];

  progressPercent = 0;
  done = false;
  firstDone = false;
  number = "";

  maxLevel = -1;

  static fromData(data: IResearchData): Research {
    const ret = new Research();
    ret.id = data.id;
    ret.name = data.name;
    ret.shape = data.shape;
    ret.description = data.description;
    ret.cost = new Decimal(data.price);
    ret.total = new Decimal(ret.cost);
    if (data.navalCapacity) ret.navalCapacity = data.navalCapacity;
    if (data.limit) ret.limit = new Decimal(data.limit);
    if (data.ship) ret.ship = data.ship;
    if (data.bonus) ret.bonus = data.bonus;
    if (data.classesToUnlock) {
      ret.classes = data.classesToUnlock.map(c =>
        Classes.find(cl => cl.id === c)
      );
      ret.classes.forEach(cla => {
        ret.toUnlock.push(cla);
      });
    }
    return ret;
  }

  addProgress(toAdd: Decimal): Decimal {
    const diff = this.total.minus(this.progress);
    this.progress = Decimal.min(this.progress.plus(toAdd), this.total);
    this.done = false;
    let ret = new Decimal(0);

    if (this.progress.gte(this.total)) {
      const name = this.getName();
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
        MainService.researchesCompleted.push("" + name);
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
      if (this.maxLevel !== 0) ResearchManager.getInstance().addAvailable(this);
      else ResearchManager.getInstance().backLog.push(this);
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
  getTime(): number {
    return this.timeToEnd;
  }
  reloadTime() {
    const resPerSec = ResearchManager.getInstance().researchPerSec;
    this.timeToEnd = resPerSec.gt(0)
      ? this.total
          .minus(this.progress)
          .div(resPerSec)
          .times(1000)
          .toNumber()
      : Number.POSITIVE_INFINITY;
  }
  //#endregion

  //#region Save and Load
  getSave(): any {
    const save = super.getSave();
    delete save.u;
    if (this.progress.gt(0)) save.p = this.progress;
    if (this.quantity.gt(0)) save.q = this.quantity;
    if (this.maxLevel !== -1) save.M = this.maxLevel;
    return save;
  }
  load(data: any): boolean {
    if (!super.load(data)) return false;
    if ("p" in data) this.progress = MyFromDecimal(data.p);
    if ("q" in data) this.quantity = MyFromDecimal(data.q);
    if ("M" in data) this.maxLevel = data.M;

    this.firstDone = this.quantity.gte(1);
    this.reloadNum();

    if (this.firstDone && this.classes) {
      this.classes.forEach(c => {
        c.unlocked = true;
      });
    }

    return true;
  }
  //#endregion
}

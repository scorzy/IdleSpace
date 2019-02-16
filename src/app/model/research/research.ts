import { AbstractUnlockable } from "../base/AbstractUnlockable";
import { IUnlockable } from "../base/IUnlockable";
import { ResearchManager } from "./researchManager";

export class Research extends AbstractUnlockable {
  progress = new Decimal(0);
  total = new Decimal(0);
  toUnlock = new Array<IUnlockable>();
  completed = false;
  resManager: ResearchManager;

  constructor(public id: string) {
    super();
  }

  addProgress(toAdd: Decimal): Decimal {
    this.progress = this.progress.plus(toAdd);

    if (this.progress.gte(this.total)) {
      this.toUnlock.forEach(u => u.unlock());
      this.completed = true;
    }

    const ret = this.total.minus(this.progress);
    return ret.min(0);
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
    return save;
  }
  load(data: any): boolean {
    if (!super.load(data)) return false;
    this.progress = new Decimal("p" in data ? data.p : 0);
    return true;
  }
}

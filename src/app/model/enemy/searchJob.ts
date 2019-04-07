import { IJob } from "../base/IJob";
import { EnemyManager } from "./enemyManager";

export class SearchJob implements IJob {
  private static lastId = 0;

  id: number;
  name = "";
  description = "";
  shape = "radar";
  total = new Decimal(0);
  progress = new Decimal(0);
  progressPercent = 0;

  moreMetal = false;
  moreCrystal = false;
  moreHabitableSpace = false;

  level = 0;
  done = false;

  constructor() {
    this.id = SearchJob.lastId;
    SearchJob.lastId = SearchJob.lastId + 1;
  }

  static FromData(data: any): SearchJob {
    const job = new SearchJob();
    if ("p" in data) job.progress = Decimal.fromDecimal(data.p);
    if ("t" in data) job.total = Decimal.fromDecimal(data.t);
    if ("l" in data) job.level = data.l;

    if ("mm" in data) job.moreMetal = data.mm;
    if ("mc" in data) job.moreCrystal = data.mc;
    if ("mh" in data) job.moreHabitableSpace = data.mh;

    job.generateNameDescription();
    job.reload();
    return job;
  }

  addProgress(toAdd: Decimal): Decimal {
    this.progress = this.progress.plus(toAdd);
    let ret = new Decimal(0);
    if (this.progress.gte(this.total)) {
      //  Done
      this.done = true;
      ret = this.progress.minus(this.total);

      EnemyManager.getInstance().generate(this);
    }
    this.reload();
    return ret;
  }
  reload() {
    this.progressPercent = Math.floor(
      this.progress.div(this.total).toNumber() * 100
    );
  }
  generateNameDescription() {
    const bonusCount =
      (this.moreMetal ? 1 : 0) +
      (this.moreCrystal ? 1 : 0) +
      (this.moreHabitableSpace ? 1 : 0);
    switch (bonusCount) {
      case 0:
        this.name = "Standard search";
        break;
      case 1:
        this.name = this.moreMetal
          ? "Metal search"
          : this.moreCrystal
          ? "Crystal search"
          : this.moreHabitableSpace
          ? "Habitable space search"
          : "";
        break;
      case 2:
        this.name = this.moreMetal ? "Metal & " : "";
        this.name += this.moreCrystal ? "Crystal " : "";
        this.name += this.moreCrystal && this.moreHabitableSpace ? "& " : "";
        this.name += this.moreHabitableSpace ? "Habitable Space " : "";
        this.name += " search";
        break;
      case 3:
        this.name = "Search everything";
    }

    this.description = "Level " + EnemyManager.romanPipe.transform(this.level);
    if (this.moreMetal) this.description += "More Metal";
    if (this.moreCrystal) this.description += "More Crystal";
    if (this.moreHabitableSpace) this.description += "More Space";
  }

  getName(): string {
    return this.name;
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
  deleteFun?(): boolean {
    EnemyManager.getInstance().searchJobs = EnemyManager.getInstance().searchJobs.filter(
      s => s !== this
    );
    return true;
  }
  getSave(): any {
    const data: any = {};
    data.p = this.progress;
    data.t = this.total;
    data.l = this.level;
    if (this.moreMetal) data.mm = this.moreMetal;
    if (this.moreCrystal) data.mc = this.moreCrystal;
    if (this.moreHabitableSpace) data.mh = this.moreHabitableSpace;
    return data;
  }
}

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
    this.name = "Standard search";
    this.description = "Level " + EnemyManager.romanPipe.transform(this.level);
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
    return data;
  }
}

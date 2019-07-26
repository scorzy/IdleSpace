import { ShipDesign } from "../fleet/shipDesign";
import { FleetManager } from "../fleet/fleetManager";
import { IJob } from "../base/IJob";
import { Shipyard } from "./shipyard";
import { MainService } from "src/app/main.service";
import { ResourceManager } from "../resource/resourceManager";
import { MyFromDecimal } from "../utility/myUtility";

export class Job implements IJob {
  private static lastId = 1;
  id = 1;
  total = new Decimal(0);
  progress = new Decimal(0);
  design: ShipDesign;
  /**
   * New Ships to add
   */
  quantity: Decimal;
  /**
   * New upgraded design
   */
  newDesign: ShipDesign;
  progressPercent = 0;
  done = false;
  name: {};
  timeToComplete = Number.POSITIVE_INFINITY;

  constructor() {
    this.id = Job.lastId + 1;
    Job.lastId = this.id;
  }
  static FromData(data: any): Job {
    const job = new Job();
    if ("p" in data) job.progress = MyFromDecimal(data.p);
    if ("t" in data) job.total = MyFromDecimal(data.t);
    if ("d" in data) {
      const design = FleetManager.getInstance().ships.find(s => s.id === data.d);
      if (design) job.design = design;
    }
    if ("q" in data) job.quantity = MyFromDecimal(data.q);
    if ("n" in data) {
      const design = FleetManager.getInstance().ships.find(s => s.id === data.n);
      if (design) job.newDesign = design;
    }
    job.reload();
    return job;
  }
  reload() {
    this.progressPercent = Math.floor(
      this.progress.div(this.total).toNumber() * 100
    );
  }
  /**
   * Add progress, if done return unused progress
   * @param toAdd progress to add
   */
  addProgress(toAdd: Decimal): Decimal {
    this.progress = this.progress.plus(toAdd);
    let ret = new Decimal(0);
    if (this.progress.gte(this.total)) {
      //  Done
      this.done = true;
      ret = this.progress.minus(this.total);
      if (this.design) {
        if (this.quantity) {
          //  Add new ships
          this.design.quantity = this.design.quantity.plus(this.quantity);
        }
        if (this.newDesign) {
          // upgrade design
          this.design.upgrade(this.newDesign);
        }
      } else {
        console.log("Design not found!");
      }
    }
    this.reload();
    return ret;
  }
  //#region IJob
  getName(): string {
    return this.design.name;
  }
  getDescription(): string {
    return this.quantity && this.quantity.gt(0)
      ? "+ " + MainService.formatPipe.transform(this.quantity, true)
      : "Design Upgrade";
  }
  getShape(): string {
    return this.design.type.shape;
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
  deleteFun(): boolean {
    Shipyard.getInstance().deleteJob(this);
    return true;
  }
  getTime(): number {
    return this.timeToComplete;
  }
  reloadTime() {
    const progressPerSec = ResourceManager.getInstance().shipyardProgress.c;
    this.timeToComplete = progressPerSec.gt(0)
      ? this.total
          .minus(this.progress)
          .div(progressPerSec)
          .times(1000)
          .toNumber()
      : Number.POSITIVE_INFINITY;
  }
  //#endregion

  getSave(): any {
    const data: any = {};
    data.p = this.progress;
    data.t = this.total;
    if (this.design) data.d = this.design.id;
    if (this.quantity) data.q = this.quantity;
    if (this.newDesign) data.n = this.newDesign.id;
    return data;
  }
}

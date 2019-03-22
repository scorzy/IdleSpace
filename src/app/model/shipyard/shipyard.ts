import { ISalvable } from "../base/ISalvable";
import { Job } from "./job";
import { ShipDesign } from "../fleet/shipDesign";
import { FleetManager } from "../fleet/fleetManager";

export class Shipyard implements ISalvable {
  private static instance: Shipyard;
  jobs = new Array<Job>();

  constructor() {
    Shipyard.instance = this;
  }
  static getInstance(): Shipyard {
    return Shipyard.instance;
  }

  /**
   *  Add progress, complete and remove jobs
   */
  addProgress(progress: Decimal) {
    while (this.jobs.length > 0 && progress.gt(0)) {
      progress = this.jobs[0].addProgress(progress);
      if (this.jobs[0].done) this.jobs.shift();
    }
  }
  /**
   *  Get sum of ToDo progress
   */
  getTotalToDo(): Decimal {
    return this.jobs
      .map(j => j.total.minus(j.progress))
      .reduce((p, c) => p.plus(c), new Decimal(0));
  }
  getTotalNavalCapacity(): Decimal {
    return this.jobs
      .filter(j => j.quantity && j.quantity.gt(0))
      .map(j => j.quantity.times(j.design.type.navalCapacity))
      .reduce((p, c) => p.plus(c), new Decimal(0));
  }
  getTotalShips(design: ShipDesign): Decimal {
    return this.jobs
      .filter(j => j.design.id === design.id)
      .map(j => j.quantity)
      .reduce((p, c) => p.plus(c), new Decimal(0));
  }
  isUpgrading(design: ShipDesign): boolean {
    return (
      this.jobs.findIndex(j => j.newDesign && j.design.id === design.id) > -1
    );
  }
  delete(design: ShipDesign) {
    this.jobs = this.jobs.filter(j => j.design.id !== design.id);
    design.isUpgrading = this.isUpgrading(design);
  }
  deleteJob(job: Job) {
    this.jobs = this.jobs.filter(j => j.id !== job.id);
    FleetManager.getInstance().upgradingCheck();
  }
  adjust(ds: ShipDesign) {
    this.jobs
      .filter(j => j.design.id === ds.id && j.quantity && j.quantity.gt(0))
      .forEach(j => {
        j.total = j.quantity.times(ds.price);
      });
  }
  //#region Save and Load
  getSave(): any {
    const data: any = {};
    if (this.jobs.length > 0) data.j = this.jobs.map(j => j.getSave());
    return data;
  }
  load(data: any): boolean {
    if ("j" in data) {
      for (const jobData of data.j) {
        if (jobData) {
          const job = Job.FromData(jobData);
          this.jobs.push(job);
        }
      }
    }
    return true;
  }
  //#endregion
}

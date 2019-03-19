import { ISalvable } from "../base/ISalvable";
import { Job } from "./job";

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
      if (progress.gt(0)) this.jobs.shift();
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
  //#region Save and Load
  getSave(): any {
    const data: any = {};
    if (this.jobs.length > 0) data.j = this.jobs.map(j => j.getSave());
    return data;
  }
  load(data: any): boolean {
    if ("j" in data) {
      for (const jobData of data.j) {
        const job = Job.FromData(jobData);
        this.jobs.push(job);
      }
    }
    return true;
  }
  //#endregion
}

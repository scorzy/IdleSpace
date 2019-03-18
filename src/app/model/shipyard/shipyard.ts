import { ISalvable } from "../base/ISalvable";
import { Job } from "./job";

export class Shipyard implements ISalvable {
  jobs = new Array<Job>();

  /**
   *  Add progress, complete and remove jobs
   */
  addProgress(progress: Decimal) {
    while (this.jobs.length > 0 && progress.gt(0)) {
      progress = this.jobs[0].addProgress(progress);
      if (progress.gt(0)) this.jobs.shift();
    }
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

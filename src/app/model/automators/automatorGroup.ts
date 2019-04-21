import { ISalvable } from "../base/ISalvable";

import { Automator } from "./automator";

export class AutomatorGroup implements ISalvable {
  name = "";
  description = "";
  automators = new Array<Automator>();

  constructor(public id: string) {}

  getCurrentAutomator(): Automator {
    return this.automators[0];
  }

  assignToResource() {}
  resetTimers() {
    const now = Date.now();
    this.automators.forEach(a => {
      a.lastExec = now;
    });
  }
  isUnlocked(): boolean {
    return this.automators.findIndex(a => a.isUnlocked()) > -1;
  }

  //#region Save and Load
  getSave() {
    const save: any = {};
    save.i = this.id;
    save.a = this.automators.filter(a => a.isUnlocked()).map(a => a.getSave());
    return save;
  }
  load(data: any): boolean {
    if (!("i" in data) || !("a" in data) || data.i !== this.id) return false;
    for (const autData of data.a) {
      if ("i" in autData) {
        const automator = this.automators.find(auto => auto.id === data.i);
        if (automator) automator.load(autData);
      }
    }
  }
  //#endregion
}

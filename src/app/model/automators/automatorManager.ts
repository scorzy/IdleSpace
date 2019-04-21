import { ISalvable } from "../base/ISalvable";
import { ResourceManager } from "../resource/resourceManager";
import { StorageAutomator } from "./storageAutomator";
import { PrestigeManager } from "../prestige/prestigeManager";
import { Automator } from "./automator";

const TIME_LEVELS = [
  [300, 0],
  [180, 0],
  [120, 0],
  [60, 0],
  [50, 2],
  [40, 3],
  [30, 4],
  [25, 5],
  [20, 6],
  [15, 7],
  [12, 8],
  [10, 6],
  [8, 7],
  [7, 8],
  [6, 9],
  [5, 10],
  [4, 11],
  [3, 12],
  [2, 13],
  [1, 14]
];

export class AutomatorManager implements ISalvable {
  automatorGroups = new Array<Automator>();
  times = new Array<number>();

  generateAutomators() {
    const resMan = ResourceManager.getInstance()
    ;[resMan.metal, resMan.crystal, resMan.alloy, resMan.energy].forEach(m => {
      const autoStorage = new StorageAutomator(m);
      this.automatorGroups.push(autoStorage);
    });
  }

  update(now: number) {
    const toDo = this.automatorGroups
      .filter(
        a => a.on && a.isUnlocked() && a.canExec(now) && a.execCondition()
      )
      .sort((a, b) => b.priority - a.priority);
    toDo.forEach(a => a.exec());
  }

  assignToResource() {
    this.automatorGroups.forEach(a => a.assignToResource());
  }
  resetTimers() {
    const totalPrestige = PrestigeManager.getInstance().totalPrestige;
    this.times = TIME_LEVELS.filter(t => t[1] <= totalPrestige).map(t => t[0]);
    this.automatorGroups.forEach(g => {
      g.resetTimers();
    });
  }

  //#region Save and Load
  getSave() {
    const save: any = {};
    save.a = this.automatorGroups
      .filter(a => a.isUnlocked())
      .map(a => a.getSave());
    return save;
  }
  load(data: any): boolean {
    if ("a" in data) return false;
    for (const autData of data.a) {
      if ("i" in autData) {
        const automator = this.automatorGroups.find(auto => auto.id === data.i);
        if (automator) automator.load(autData);
      }
    }
  }
  //#endregion
}

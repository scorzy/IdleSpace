import { ISalvable } from "../base/ISalvable";
import { ResourceManager } from "../resource/resourceManager";
import { StorageAutomator } from "./storageAutomator";
import { PrestigeManager } from "../prestige/prestigeManager";
import { Automator } from "./automator";
import { RobotAutomator } from "./robotAutomator";
import { RobotEndingAutomator } from "./robotEndingAutomator";
import { MineAutomator } from "./mineAutomator";
import { BuildingAutomator } from "./buildingAutomator";
import { RobotGroupAutomator } from "./robotGroupAutomator";
import { MineGroupAutomator } from "./multipleMineAutomator";
import { BuildingGroupAutomator } from "./buildingGroupAutomator";

export const TIME_LEVELS = [
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
  [10, 9],
  [8, 10],
  [7, 11],
  [6, 12],
  [5, 13],
  [4, 14],
  [3, 15],
  [2, 16],
  [1, 17]
];

export class AutomatorManager implements ISalvable {
  automatorGroups = new Array<Automator>();
  times = new Array<number>();

  generateAutomators() {
    //  Resource Storage
    const resMan = ResourceManager.getInstance()
    ;[resMan.metal, resMan.crystal, resMan.alloy, resMan.energy].forEach(m => {
      const autoStorage = new StorageAutomator(m);
      this.automatorGroups.push(autoStorage);
    });

    //  Buy Robot 1
    resMan.tier1.forEach(r => {
      const autoBuy = new RobotAutomator(r);
      this.automatorGroups.push(autoBuy);
    });

    //  Buy Robot Ending
    resMan.tier1.forEach(r => {
      const material = r.products[0].product;
      const autoBuy = new RobotEndingAutomator(r, material);
      this.automatorGroups.push(autoBuy);
    });

    //  Mine Automators
    resMan.tier1.forEach(r => {
      const autoBuy = new MineAutomator(r);
      this.automatorGroups.push(autoBuy);
    });

    //  Building 1
    resMan.tier2.forEach(r => {
      r.automation1Name = "Buildings Automation";
      const autoBuy = new BuildingAutomator(r);
      this.automatorGroups.push(autoBuy);
    });

    //  Buy Drone Group
    for (let i = 0; i < 3; i++) {
      const autoGr1 = new RobotGroupAutomator(resMan.tierGroups[1], i + 1);
      this.automatorGroups.push(autoGr1);
    }

    //  Buy Mine Group
    for (let i = 0; i < 3; i++) {
      const autoGr1 = new MineGroupAutomator(resMan.tierGroups[1], i + 1);
      this.automatorGroups.push(autoGr1);
    }

    //  Buy Buildings Group
    for (let i = 0; i < 3; i++) {
      const autoGr1 = new BuildingGroupAutomator(resMan.tierGroups[2], i + 1);
      this.automatorGroups.push(autoGr1);
    }
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
    if (!("a" in data)) return false;
    for (const autData of data.a) {
      if ("i" in autData) {
        const automator = this.automatorGroups.find(auto => auto.id === data.i);
        if (automator) automator.load(autData);
      }
    }
  }
  //#endregion
}

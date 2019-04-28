import { ISalvable } from "../base/ISalvable";
import { ResourceManager } from "../resource/resourceManager";
import { PrestigeManager } from "../prestige/prestigeManager";
import { Automator } from "./automator";
import { RobotAutomator } from "./robotAutomator";
import { RobotEndingAutomator } from "./robotEndingAutomator";
import { MineAutomator } from "./mineAutomator";
import { BuildingAutomator } from "./buildingAutomator";
import { RobotGroupAutomator } from "./robotGroupAutomator";
import { MineGroupAutomator } from "./multipleMineAutomator";
import { BuildingGroupAutomator } from "./buildingGroupAutomator";
import { FleetAutomator } from "./fleetAutomator";
import { EnemyDeleteAutomator } from "./enemyDeleteAutomator";
import { SearchAutomator } from "./searchAutomator";
import { ShipyardWarp } from "./shipyardWarpAutomator";

export const TIME_LEVELS = [
  [300, 0],
  [180, 0],
  [120, 0],
  [60, 0],
  [50, 2],
  [40, 3],
  [30, 5],
  [25, 7],
  [20, 9],
  [15, 11],
  [12, 13],
  [10, 15],
  [8, 18],
  [7, 22],
  [6, 26],
  [5, 30],
  [4, 35],
  [3, 40],
  [2, 50],
  [1, 60]
];

export class AutomatorManager implements ISalvable {
  static automatorLevel = 0;

  automatorGroups = new Array<Automator>();
  times = new Array<number>();
  autoFleetUp: FleetAutomator;
  shipyardWarp: ShipyardWarp;
  searchAutomator: SearchAutomator;
  enemyDeleteAutomator: EnemyDeleteAutomator;
  searchAutomators: Automator[];

  constructor() {
    AutomatorManager.automatorLevel = 0;
  }
  generateAutomators() {
    //  Resource Storage
    // const resMan = ResourceManager.getInstance()
    // ;[resMan.metal, resMan.crystal, resMan.alloy, resMan.energy].forEach(m => {
    //   const autoStorage = new StorageAutomator(m);
    //   this.automatorGroups.push(autoStorage);
    // });

    const resMan = ResourceManager.getInstance();

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

    //  Auto Upgrade
    this.autoFleetUp = new FleetAutomator();
    this.automatorGroups.push(this.autoFleetUp);
    this.shipyardWarp = new ShipyardWarp();
    this.automatorGroups.push(this.shipyardWarp);

    //  Enemy Search
    this.searchAutomator = new SearchAutomator();
    this.automatorGroups.push(this.searchAutomator);

    //  Enemy Delete
    this.enemyDeleteAutomator = new EnemyDeleteAutomator();
    this.automatorGroups.push(this.enemyDeleteAutomator);
    this.searchAutomators = [this.searchAutomator, this.enemyDeleteAutomator];
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
    this.times = TIME_LEVELS.filter(
      t => AutomatorManager.automatorLevel >= t[1]
    ).map(t => t[0]);
    this.automatorGroups.forEach(g => {
      g.resetTimers();
    });
  }
  setAutomatorLevel(oldPrestige = 0) {
    AutomatorManager.automatorLevel = Math.max(
      AutomatorManager.automatorLevel,
      Math.max(oldPrestige, PrestigeManager.getInstance().totalPrestige) *
        (1 + 0.3 * PrestigeManager.getInstance().ascension)
    );
  }

  //#region Save and Load
  getSave() {
    const save: any = {};
    save.a = this.automatorGroups
      .filter(a => a.isUnlocked())
      .map(a => a.getSave());
    save.l = AutomatorManager.automatorLevel;
    return save;
  }
  load(data: any): boolean {
    if (!("a" in data)) return false;
    this.setAutomatorLevel();
    if ("l" in data) AutomatorManager.automatorLevel = data.l;
    for (const autData of data.a) {
      if ("i" in autData) {
        const automator = this.automatorGroups.find(
          auto => auto.id === autData.i
        );
        if (automator) automator.load(autData);
      }
    }
  }
  //#endregion
}

import { Research } from "./research";
import { ResourceManager } from "../resource/resourceManager";
import { ResearchData } from "./researchData";
import { FleetManager } from "../fleet/fleetManager";
import { IResearchData } from "./iResearchData";
import { EnemyManager } from "../enemy/enemyManager";
import { SearchJob } from "../enemy/searchJob";
import { ShipDesign } from "../fleet/shipDesign";
import { CORVETTE_PRESET } from "../enemy/preset";
import { Bonus } from "../bonus/bonus";

export class ResearchManager {
  private static instance: ResearchManager;

  researches = new Array<Research>();
  toDo = new Array<Research>();
  backLog = new Array<Research>();
  completed = new Array<Research>();
  isNew = false;
  isNewModal = false;
  //#region Researches
  betterResearch: Research;
  energy: Research;
  modding: Research;
  telescope: Research;
  scavenger: Research;
  //#region Ship Types
  corvette: Research;
  frigate: Research;
  destroyer: Research;
  cruiser: Research;
  battlecruiser: Research;
  battleship: Research;
  //#endregion
  //#endregion
  researchPerSec = new Decimal(0);

  constructor() {
    ResearchManager.instance = this;

    for (const resData of ResearchData) {
      this.researches.push(Research.fromData(resData));
    }
    this.betterResearch = this.researches.find(r => r.id === "r");
    this.corvette = this.researches.find(r => r.id === "c");
    this.frigate = this.researches.find(r => r.id === "f");
    this.destroyer = this.researches.find(r => r.id === "d");
    this.cruiser = this.researches.find(r => r.id === "b");
    this.battlecruiser = this.researches.find(r => r.id === "t");
    this.battleship = this.researches.find(r => r.id === "s");
    this.modding = this.researches.find(r => r.id === "M");
    this.telescope = this.researches.find(r => r.id === "X1");
    this.energy = this.researches.find(r => r.id === "E");
    this.scavenger = this.researches.find(r => r.id === "SC");
    ResourceManager.getInstance().energyX1.productionMultiplier.additiveBonus.push(
      new Bonus(this.energy, 0.1)
    );

    this.corvette.onBuy = () => {
      EnemyManager.getInstance().generate(new SearchJob());
      EnemyManager.getInstance().attack(EnemyManager.getInstance().allEnemy[0]);
      FleetManager.getInstance()
        .allModules.filter(m => m.start)
        .forEach(m => {
          m.research.quantity = new Decimal(1);
          m.research.reloadNum();
          m.unlock();
        });
      const corvetteDesign = ShipDesign.fromPreset(CORVETTE_PRESET);
      corvetteDesign.id = "0";
      FleetManager.getInstance().ships.push(corvetteDesign);
    };

    this.toDo = [this.betterResearch];
  }
  static getInstance() {
    return ResearchManager.instance;
  }

  setUnlocks() {
    this.researches.forEach(r => {
      const data = ResearchData.find(rd => rd.id === r.id);
      if (data) {
        if (data.researchToUnlock) {
          for (const resToUnData of data.researchToUnlock) {
            const toUnlock = this.researches.find(res => res.id === resToUnData);
            r.toUnlock.push(toUnlock);
          }
        }

        if (data.resourceToUnlock) {
          for (const resToUnData of data.resourceToUnlock) {
            const toUnlock = ResourceManager.getInstance().allResources.find(
              res => res.id === resToUnData
            );
            r.toUnlock.push(toUnlock);
          }
        }

        if (data.otherToUnlock) {
          for (const toUnlockFun of data.otherToUnlock) {
            r.toUnlock.push(toUnlockFun());
          }
        }
      }
    });
  }
  /**
   * Generate researches for ship modules
   */
  addOtherResearches() {
    //  Create researches for modules
    let moduleResearches = new Array<Research>();
    FleetManager.getInstance().allModules.forEach(m => {
      const resData: IResearchData = {
        id: m.id + "-R",
        name: m.name,
        shape: m.shape,
        price: 1e4,
        description: "Unlock " + m.name
      };
      const research = Research.fromData(resData);
      research.limit = new Decimal(1e4);
      research.toUnlock.push(m);
      m.research = research;
      moduleResearches.push(research);
      this.researches.push(research);
    });

    //  Make research tree
    FleetManager.getInstance()
      .allModules.filter(h => h.nextToUnlock)
      .forEach(m => {
        m.nextToUnlock
          .map(n => FleetManager.getInstance().allModules.find(l => l.id === n))
          .forEach(modToUnlock => {
            m.research.toUnlock.push(modToUnlock.research);
            moduleResearches = moduleResearches.filter(
              p => p !== modToUnlock.research
            );
          });
      });

    //  Add other modules to corvette research
    this.corvette.toUnlock = this.corvette.toUnlock.concat(moduleResearches);
  }

  update(progress: Decimal) {
    while (progress.gt(0) && this.toDo.length > 0) {
      const res = this.toDo[0];
      progress = res.addProgress(progress);
      if (res.completed) {
        this.toDo.shift();
        this.completed.push(res);
      } else if (progress.gt(0)) {
        this.toDo.shift();
        this.toDo.push(res);
      }
    }
  }
  addAvailable(res: Research) {
    if (!res.completed && !this.toDo.includes(res)) this.toDo.push(res);
  }

  getSave(): any {
    const save: any = {};
    save.t = this.toDo.map(r => r.getSave());
    save.b = this.backLog.map(r => r.getSave());
    save.c = this.completed.map(r => r.getSave());
    return save;
  }
  load(data: any): boolean {
    this.toDo = [];
    this.backLog = [];
    this.completed = [];

    if ("t" in data) {
      for (const res of data.t) {
        const research = this.researches.find(u => u.id === res.i);
        if (research) {
          research.load(res);
          this.toDo.push(research);
        }
      }
    }

    if ("b" in data) {
      for (const res of data.b) {
        const research = this.researches.find(u => u.id === res.i);
        if (research) {
          research.load(res);
          this.backLog.push(research);
        }
      }
    }

    if ("c" in data) {
      for (const res of data.c) {
        const research = this.researches.find(u => u.id === res.i);
        if (research) {
          research.load(res);
          if (research.quantity.gte(research.limit)) {
            research.done = true;
            this.completed.push(research);
          } else {
            this.toDo.push(research);
          }
        }
      }
    }

    return true;
  }
  /**
   * Unlock stuff tha should be unlocked
   * Used for new added researches
   */
  fixUnlocks() {
    this.researches
      .filter(r => r.firstDone)
      .forEach(r => {
        r.toUnlock
          .filter(t => !t.unlocked)
          .forEach(t => {
            t.unlock();
          });
      });
  }
  reloadTimes() {
    this.backLog.forEach(r => r.reloadTime());
    this.toDo.forEach(r => r.reloadTime());
  }
}

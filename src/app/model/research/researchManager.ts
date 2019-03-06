import { Research } from "./research";
import { ResourceManager } from "../resource/resourceManager";

export class ResearchManager {
  private static instance: ResearchManager;

  researches = new Array<Research>();
  toDo = new Array<Research>();
  completed = new Array<Research>();

  //#region Researches
  betterResearch: Research;
  alloy: Research;
  //#region Ship Types
  corvette: Research;
  frigate: Research;
  destroyer: Research;
  cruiser: Research;
  battlecruiser: Research;
  battleship: Research;
  //#endregion
  //#endregion

  constructor() {
    const resManager = ResourceManager.getInstance();
    ResearchManager.instance = this;
    this.betterResearch = new Research("r", 50);
    this.betterResearch.limit = new Decimal(Number.POSITIVE_INFINITY);

    this.corvette = new Research("c", 200);
    this.frigate = new Research("f", 200);
    this.destroyer = new Research("d", 200);
    this.cruiser = new Research("b", 200);
    this.battlecruiser = new Research("t", 200);
    this.battleship = new Research("s", 200);

    this.corvette.toUnlock = [this.frigate];
    this.frigate.toUnlock = [this.destroyer];
    this.destroyer.toUnlock = [this.cruiser];
    this.cruiser.toUnlock = [this.battlecruiser];
    this.battlecruiser.toUnlock = [this.battleship];

    this.alloy = new Research("a", 100);
    this.alloy.toUnlock = [
      resManager.alloy,
      resManager.alloyFoundry,
      resManager.alloyX1,
      this.corvette
    ];

    this.toDo = [this.betterResearch, this.alloy];
    this.researches = [
      this.alloy,
      this.betterResearch,
      this.corvette,
      this.frigate,
      this.destroyer,
      this.cruiser,
      this.battlecruiser
    ];
  }
  static getInstance() {
    return ResearchManager.instance;
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
    save.c = this.completed.map(r => r.getSave());
    return save;
  }
  load(data: any): boolean {
    this.toDo = [];
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

    if ("c" in data) {
      for (const res of data.c) {
        const research = this.researches.find(u => u.id === res.i);
        if (research) {
          research.load(res);
          research.done = true;
          this.completed.push(research);
        }
      }
    }

    return true;
  }
}

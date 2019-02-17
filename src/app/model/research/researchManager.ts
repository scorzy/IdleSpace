import { Research } from "./research";

export class ResearchManager {
  researches = new Array<Research>();
  toDo = new Array<Research>();
  completed = new Array<Research>();

  //#region Researches

  //#endregion

  constructor() {}

  update(progress: Decimal) {
    while (progress.gt(0) && this.toDo.length > 0) {
      const res = this.toDo[0];
      progress = res.addProgress(progress);
      if (res.completed) {
        this.toDo.shift();
        this.completed.push(res);
      } else if (progress.gte(0)) {
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
      for (const res of data.t) {
        const research = this.researches.find(u => u.id === res.i);
        if (research) {
          research.load(res);
          this.completed.push(research);
        }
      }
    }

    return true;
  }
}

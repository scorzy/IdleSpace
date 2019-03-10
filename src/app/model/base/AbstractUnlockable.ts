import { IUnlockable } from "./IUnlockable";
import { ISalvable } from "./ISalvable";

export abstract class AbstractUnlockable implements IUnlockable, ISalvable {
  id: string;
  unlocked: boolean;
  name: string;
  description: string;
  private defaultUnlocked = false;

  setDefaultUnlocked(def = true) {
    this.defaultUnlocked = def;
    this.unlocked = def;
  }
  unlock(): boolean {
    if (!this.unlocked) {
      this.unlocked = true;
      return true;
    }
    return false;
  }
  reset(): void {
    this.unlocked = false;
  }
  getSave(): any {
    const data: any = {};
    data.i = this.id;
    if (this.unlocked !== this.defaultUnlocked) {
      data.u = this.unlocked;
    }
    return data;
  }
  load(data: any): boolean {
    if (!("i" in data && data.i === this.id)) return false;
    if ("u" in data) this.unlocked = data.u;
    return true;
  }
}

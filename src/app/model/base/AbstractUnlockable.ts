import { IUnlockable } from "./IUnlockable";
import { ISalvable } from "./ISalvable";

export abstract class AbstractUnlockable implements IUnlockable, ISalvable {
  id: string;
  unlocked: boolean;
  unlock(): boolean {
    this.unlocked = true;
    return this.unlocked;
  }
  reset(): void {
    this.unlocked = true;
  }
  getSave(): any {
    const data: any = {};
    data.i = this.id;
    if (this.unlocked) {
      data.u = true;
    }
    return data;
  }
  load(data: any): boolean {
    if (!("i" in data && data.i === this.id)) return false;
    this.unlocked = !!data.u;
    return true;
  }
}

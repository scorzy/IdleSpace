import { ISalvable } from "../base/ISalvable";
import { PrestigeManager } from "../prestige/prestigeManager";
import { Resource } from "../resource/resource";

export class Automator implements ISalvable {
  name = "";
  description = "";
  on = false;
  prestigeLevel = 1;
  minInterval = 60;
  priority = 1;
  lastExec = 0;
  resourcePercentToUse = 100;
  resource: Resource;
  constructor(public id: string) {}

  isUnlocked(): boolean {
    return this.prestigeLevel <= PrestigeManager.getInstance().totalPrestige;
  }

  canExec(now: number): boolean {
    return this.lastExec + this.minInterval * 1000 < now;
  }
  execCondition(): boolean {
    return true;
  }
  doAction(): boolean {
    return true;
  }
  exec() {
    if (this.doAction()) this.lastExec = Date.now();
  }
  assignToResource() {
    if (this.resource) this.resource.automators.push(this);
  }
  resetTimers() {
    this.lastExec = Date.now();
  }

  getSave(): any {
    const data: any = {};
    data.i = this.id;
    if (this.priority !== 1) data.p = this.priority;
    if (this.minInterval !== 1) data.m = this.minInterval;
    if (this.on) data.o = this.on;
    return data;
  }
  load(data: any): boolean {
    if (!("i" in data && data.i === this.id)) return false;
    if ("p" in data) this.priority = data.p;
    if ("m" in data) this.minInterval = data.m;
    if ("o" in data) this.on = data.o;
    return true;
  }
}

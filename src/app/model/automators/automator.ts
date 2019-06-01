import { ISalvable } from "../base/ISalvable";
import { PrestigeManager } from "../prestige/prestigeManager";
import { Resource } from "../resource/resource";
import { ResourceManager } from "../resource/resourceManager";
import { AutomatorManager } from "./automatorManager";

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
  group = 1;
  stopWhenFactory = false;
  stopWhenFactoryUi = false;
  showResourceUsage = true;
  constructor(public id: string) {}

  isUnlocked(): boolean {
    return (
      AutomatorManager.automatorLevel >=
      PrestigeManager.getInstance().totalPrestige
    );
  }

  canExec(now: number): boolean {
    if (
      this.stopWhenFactory &&
      ResourceManager.getInstance().droneFactory.quantity.gte(1)
    ) {
      return false;
    }
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
    if (this.resource && this.group === 1) this.resource.automators.push(this);
    if (this.resource && this.group === 2) this.resource.automators2.push(this);
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
    if (this.resourcePercentToUse !== 100) data.r = this.resourcePercentToUse;
    if (this.stopWhenFactory) data.swf = this.stopWhenFactory;
    return data;
  }
  load(data: any): boolean {
    if (!("i" in data && data.i === this.id)) return false;
    if ("p" in data) this.priority = data.p;
    if ("m" in data) this.minInterval = data.m;
    if ("o" in data) this.on = data.o;
    if ("r" in data) this.resourcePercentToUse = data.r;
    if ("swf" in data) this.stopWhenFactory = data.swf;
    return true;
  }
}

import { ISalvable } from "../base/ISalvable";
import { AllSkillEffects } from "./allSkillEffects";
import { EnemyManager } from "../enemy/enemyManager";
import { SkillEffect } from "./skillEffects";

export class PrestigeManager implements ISalvable {
  private static instance: PrestigeManager;

  usedPrestige = 0;
  totalPrestige = 0;
  maxPrestigePoints = 1;
  prestigeToEarn = 0;
  ascension = 0;

  constructor() {
    PrestigeManager.instance = this;

    AllSkillEffects.initialize();
  }
  static getInstance(): PrestigeManager {
    return PrestigeManager.instance;
  }
  buySkill(effect: SkillEffect): boolean {
    const multi = Math.max(2 * this.ascension, 1);
    effect.numBuy++;
    effect.numOwned = multi * effect.numBuy;
    effect.afterBuy();

    return true;
  }
  reloadPrestigeToEarn() {
    this.prestigeToEarn = Math.max(
      EnemyManager.getInstance().maxLevel - this.totalPrestige - 1,
      0
    );
  }
  canAscend(): boolean {
    return this.prestigeToEarn + this.totalPrestige >= 20 * (1 + this.ascension);
  }
  ascend() {
    this.ascension++;
    this.totalPrestige = this.ascension;
    this.reset();
  }
  reset() {
    this.usedPrestige = 0;
    AllSkillEffects.effectList.forEach(e => {
      e.numBuy = 0;
      e.numOwned = 0;
    });
  }

  //#region Save and Load
  getSave(): any {
    const save: any = {};
    if (this.ascension > 0) save.a = this.ascension;
    save.t = this.totalPrestige;
    save.s = AllSkillEffects.effectList
      .filter(e => e.numBuy > 0)
      .map(e => e.getSave());
    return save;
  }
  load(data: any): boolean {
    this.reset();
    if ("t" in data) this.totalPrestige = data.t;
    if ("a" in data) this.ascension = data.a;
    if ("s" in data) {
      for (const effData of data.s) {
        const effect = AllSkillEffects.effectList.find(e => e.id === effData.i);
        effect.load(effData);
      }
    }
    const multi = Math.max(2 * this.ascension, 1);
    AllSkillEffects.effectList
      .filter(e => e.numBuy > 0)
      .forEach(e => {
        e.numOwned = e.numBuy * multi;
      });

    return true;
  }
  //#endregion
}

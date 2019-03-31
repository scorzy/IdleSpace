import { Skill } from "./skill";
import { ISalvable } from "../base/ISalvable";
import { AllSkillEffects } from "./allSkillEffects";

export class PrestigeManager implements ISalvable {
  private static instance: PrestigeManager;

  usedPrestige = 0;
  totalPrestige = 0;
  skills: Skill[][] = new Array<Skill[]>();
  allSkills = new Array<Skill>();

  constructor() {
    PrestigeManager.instance = this;
    AllSkillEffects.initialize();

    for (let i = 0; i < 10; i++) {
      this.skills[i] = [];
      for (let k = 0; k < 10; k++) {
        const skill = new Skill(i, k);
        this.skills[i][k] = skill;
        this.allSkills.push(skill);
      }
    }
    this.skills[2][2].buyable = true;
    this.skills[2][7].buyable = true;
    this.skills[7][2].buyable = true;
    this.skills[7][7].buyable = true;

    this.skills[2][2].owned = true;
  }
  static getInstance(): PrestigeManager {
    return PrestigeManager.instance;
  }
  buySkill(): boolean {
    if (this.usedPrestige >= this.totalPrestige) return false;
    this.usedPrestige++;
    return true;
  }

  unlockOther(skill: Skill) {
    for (let posI = -1; posI < 2; posI++) {
      for (let posK = -1; posK < 2; posK++) {
        const otherI = skill.i + posI;
        const otherK = skill.k + posK;
        if (otherI >= 0 && otherI < 100 && otherK >= 0 && otherK < 100) {
          this.skills[otherI][otherK].buyable = true;
        }
      }
    }
  }

  //#region Save and Load
  getSave(): any {
    const save: any = {};
    save.o = this.allSkills.filter(s => s.owned).map(s => s.id);
    return save;
  }
  load(data: any): boolean {
    if ("o" in data) {
      for (const id of data.o) {
        const skill = this.allSkills.find(s => s.id === id);
        if (skill) skill.owned = true;
        this.usedPrestige++;
        skill.effect.numOwned++;
        this.unlockOther(skill);
      }
    }
    return true;
  }
  //#endregion
}

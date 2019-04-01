import { SkillEffect } from "./skillEffects";
import { skillsData } from "./skillsData";
import { PrestigeManager } from "./prestigeManager";
import { AllSkillEffects } from "./allSkillEffects";

export class Skill {
  id: number;
  effect: SkillEffect;
  buyable = false;
  owned = false;
  constructor(public i: number, public k: number) {
    try {
      this.effect = skillsData[i][k];
    } catch {}

    if (!this.effect) this.effect = AllSkillEffects.PLUS_METAL_MINER;
    this.id = i * 10 + k;
  }

  buy(): boolean {
    if (
      this.owned ||
      !this.buyable ||
      !PrestigeManager.getInstance().buySkill()
    ) {
      return false;
    }
    this.owned = true;
    this.effect.numOwned++;
    this.effect.afterBuy();
    PrestigeManager.getInstance().unlockOther(this);
    return true;
  }
}

import { SkillEffect } from "./skillEffects";
import { AllSkillEffects } from "./allSkillEffects";

export const BUYABLE_COLOR = "#008000ee";
export const OWNED_COLOR = "#ff0000ee";
export const NOT_AVAILABLE_COLOR = "#4286f4ee";

export class Skill {
  effectId: number;
  label = "";
  owned = false;
  color = NOT_AVAILABLE_COLOR;

  constructor(public id: number, effect: SkillEffect, public buyable = false) {
    if (!effect) effect = AllSkillEffects.PLUS_METAL_MINER;
    this.label = effect.label;
    this.effectId = effect.id;
    if (buyable) this.color = BUYABLE_COLOR;
  }
}

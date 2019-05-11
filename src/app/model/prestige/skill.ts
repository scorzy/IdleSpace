import { SkillEffect } from "./skillEffects";
import { AllSkillEffects } from "./allSkillEffects";
import { positions } from "./positions";

export const BUYABLE_COLOR = "#FFB38Fee";
export const OWNED_COLOR = "#0094D3ee";
export const NOT_AVAILABLE_COLOR = "#A6D8E7aa";

export class Skill {
  effectId: string;
  label = "";
  owned = false;
  color = NOT_AVAILABLE_COLOR;
  x = 0;
  y = 0;

  constructor(public id: number, effect: SkillEffect, public buyable = false) {
    if (!effect) effect = AllSkillEffects.PLUS_METAL_MINER;
    this.label = effect.label;
    this.effectId = effect.id;
    if (buyable) this.color = BUYABLE_COLOR;
    if (this.id in positions) {
      this.x = positions[this.id].x;
      this.y = positions[this.id].y;
    }
  }
}

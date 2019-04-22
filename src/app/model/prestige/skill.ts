import { SkillEffect } from "./skillEffects";
import { AllSkillEffects } from "./allSkillEffects";
import { positions } from "./positions";

export const BUYABLE_COLOR = "#008000ee";
export const OWNED_COLOR = "#ff0000ee";
export const NOT_AVAILABLE_COLOR = "#4286f4ee";

export class Skill {
  effectId: string;
  label = "";
  owned = false;
  color = NOT_AVAILABLE_COLOR;
  x = 0;
  y = 0;

  constructor(public id: number, effect: SkillEffect, public buyable = false) {
    if (!effect) effect = AllSkillEffects.PLUS_METAL_MINER;
    this.label = this.id + " " + effect.label;
    this.effectId = effect.id;
    if (buyable) this.color = BUYABLE_COLOR;
    if (this.id in positions) {
      this.x = positions[this.id].x;
      this.y = positions[this.id].y;
    }
  }
}

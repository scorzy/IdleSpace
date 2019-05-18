import { SkillEffect } from "./skillEffects";

export class SkillGroup {
  id = "";
  name = "";
  maxPercent = 1;
  skills = new Array<SkillEffect>();
}

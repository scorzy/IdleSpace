import { Skill, BUYABLE_COLOR, OWNED_COLOR } from "./skill";
import { ISalvable } from "../base/ISalvable";
import { AllSkillEffects } from "./allSkillEffects";
import { DataSet } from "vis";

export class PrestigeManager implements ISalvable {
  private static instance: PrestigeManager;

  usedPrestige = 0;
  totalPrestige = 0;

  visSkills: DataSet<Skill>;
  visEdge: DataSet<{ from: number; to: number }>;

  constructor() {
    PrestigeManager.instance = this;
    AllSkillEffects.initialize();

    this.visSkills = new DataSet([
      new Skill(1, AllSkillEffects.PLUS_METAL_MINER, true),
      new Skill(2, AllSkillEffects.PLUS_CRYSTAL_MINER),
      new Skill(3, AllSkillEffects.PLUS_ALLOY),
      new Skill(4, AllSkillEffects.PLUS_ENERGY),
      new Skill(5, AllSkillEffects.PLUS_BATTERY),
      new Skill(6, AllSkillEffects.PLUS_CPU),
      new Skill(7, AllSkillEffects.PLUS_WORKER),
      new Skill(8, AllSkillEffects.PLUS_WARRIOR),
      new Skill(9, AllSkillEffects.PLUS_SEARCH),
      new Skill(10, AllSkillEffects.FAST_COMBAT),
      new Skill(11, AllSkillEffects.DOUBLE_NAVAL_CAPACITY),
      new Skill(12, AllSkillEffects.FACTORY_BONUS),
      new Skill(13, AllSkillEffects.MODDING_PLUS)
    ]);

    this.visEdge = new DataSet([
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 1, to: 4 },
      { from: 4, to: 5 },
      { from: 4, to: 6 },
      { from: 3, to: 7 },
      { from: 6, to: 8 },
      { from: 6, to: 9 },
      { from: 8, to: 10 },
      { from: 10, to: 11 },
      { from: 3, to: 12 },
      { from: 12, to: 13 }
    ]);
  }
  static getInstance(): PrestigeManager {
    return PrestigeManager.instance;
  }
  buySkill(skillId: number): boolean {
    if (this.usedPrestige >= this.totalPrestige) return false;

    const skill = this.visSkills.get(skillId);
    if (skill.owned || !skill.buyable) return false;

    this.usedPrestige++;
    skill.owned = true;
    skill.color = OWNED_COLOR;
    const effect = AllSkillEffects.effectList.find(
      eff => eff.id === skill.effectId
    );
    effect.numOwned++;
    effect.afterBuy();
    this.unlockOther(skill);

    this.visSkills.update(skill);

    return true;
  }
  unlockOther(skill: Skill) {
    const avEdges = this.visEdge.get({
      filter(item) {
        return item.from === skill.id || item.to === skill.id;
      }
    });
    avEdges.forEach(avEdge => {
      const nodes = this.visSkills.get({
        filter(item) {
          return (
            (item.id === avEdge.from || item.id === avEdge.to) &&
            !item.buyable &&
            !item.owned
          );
        }
      });

      if (nodes.length > 0) {
        nodes.forEach(n => {
          {
            n.buyable = true;
            n.color = BUYABLE_COLOR;
          }
        });
        this.visSkills.update(nodes);
      }
    });
  }

  //#region Save and Load
  getSave(): any {
    const save: any = {};
    save.t = this.totalPrestige;
    save.o = this.visSkills
      .get({
        filter(item) {
          return item.owned;
        }
      })
      .map(o => o.id);
    return save;
  }
  load(data: any): boolean {
    if ("t" in data) this.totalPrestige = data.t;
    if ("o" in data) {
      data.o.forEach(o => this.buySkill(o));
    }

    return true;
  }
  //#endregion
}

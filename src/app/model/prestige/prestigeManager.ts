import { Skill, BUYABLE_COLOR, OWNED_COLOR } from "./skill";
import { ISalvable } from "../base/ISalvable";
import { AllSkillEffects } from "./allSkillEffects";
import { DataSet } from "vis";
import { EnemyManager } from "../enemy/enemyManager";

export class PrestigeManager implements ISalvable {
  private static instance: PrestigeManager;

  usedPrestige = 0;
  totalPrestige = 0;
  visSkills: DataSet<Skill>;
  visEdge: DataSet<{ from: number; to: number }>;
  maxPrestigePoints = 1;
  prestigeToEarn = 0;
  ascension = 0;

  constructor() {
    PrestigeManager.instance = this;
    AllSkillEffects.initialize();

    this.visSkills = new DataSet(this.getDataset());

    this.visEdge = new DataSet([
      { from: 2, to: 3 },
      { from: 4, to: 6 },
      { from: 3, to: 7 },
      { from: 6, to: 8 },
      { from: 6, to: 9 },
      { from: 8, to: 11 },
      { from: 11, to: 10 },
      { from: 3, to: 12 },
      { from: 12, to: 13 },
      { from: 9, to: 14 },
      { from: 14, to: 15 },
      { from: 14, to: 16 },
      { from: 14, to: 17 },
      { from: 8, to: 18 },
      { from: 3, to: 20 },
      { from: 4, to: 19 },
      { from: 6, to: 21 },
      { from: 7, to: 22 },
      { from: 13, to: 23 },
      { from: 1, to: 24 },
      { from: 2, to: 25 },
      { from: 3, to: 26 },
      { from: 4, to: 27 },
      { from: 6, to: 29 },
      { from: 7, to: 30 },
      { from: 8, to: 31 },
      { from: 9, to: 32 },
      { from: 21, to: 33 },
      { from: 11, to: 34 },
      { from: 39, to: 1 },
      { from: 39, to: 2 },
      { from: 39, to: 4 },
      { from: 35, to: 36 },
      { from: 11, to: 37 },
      { from: 37, to: 38 },
      { from: 8, to: 35 },
      { from: 18, to: 40 },
      { from: 11, to: 41 },
      { from: 12, to: 42 },
      { from: 24, to: 43 },
      { from: 25, to: 44 },
      { from: 26, to: 45 },
      { from: 27, to: 46 },
      { from: 29, to: 47 },
      { from: 30, to: 48 },
      { from: 32, to: 49 },
      { from: 17, to: 50 },
      { from: 14, to: 51 },
      { from: 33, to: 52 },
      { from: 21, to: 53 },
      { from: 14, to: 54 },
      { from: 54, to: 55 },
      { from: 55, to: 56 },
      { from: 51, to: 57 },
      { from: 36, to: 58 },
      { from: 58, to: 59 },
      { from: 11, to: 60 },
      { from: 60, to: 61 },
      { from: 61, to: 62 },
      { from: 62, to: 63 },
      { from: 63, to: 64 }
    ]);

    this.maxPrestigePoints = this.visSkills.length;
  }
  static getInstance(): PrestigeManager {
    return PrestigeManager.instance;
  }
  getDataset(): Skill[] {
    return [
      new Skill(1, AllSkillEffects.PLUS_METAL_MINER),
      new Skill(2, AllSkillEffects.PLUS_CRYSTAL_MINER),
      new Skill(3, AllSkillEffects.PLUS_ALLOY),
      new Skill(4, AllSkillEffects.PLUS_ENERGY),
      new Skill(6, AllSkillEffects.PLUS_CPU),
      new Skill(7, AllSkillEffects.PLUS_WORKER),
      new Skill(8, AllSkillEffects.PLUS_WARRIOR),
      new Skill(9, AllSkillEffects.PLUS_SEARCH),
      new Skill(10, AllSkillEffects.FAST_COMBAT),
      new Skill(11, AllSkillEffects.DOUBLE_NAVAL_CAPACITY),
      new Skill(12, AllSkillEffects.FACTORY_BONUS),
      new Skill(13, AllSkillEffects.MODDING_PLUS),
      new Skill(14, AllSkillEffects.SEARCH_MULTI),
      new Skill(15, AllSkillEffects.SEARCH_METAL),
      new Skill(16, AllSkillEffects.SEARCH_CRY),
      new Skill(17, AllSkillEffects.SEARCH_HAB),
      new Skill(18, AllSkillEffects.DOUBLE_DARK_MATTER),
      new Skill(19, AllSkillEffects.RESEARCH_MULTI),
      new Skill(20, AllSkillEffects.ALLOY_MULTI),
      new Skill(21, AllSkillEffects.COMPUTING_MULTI),
      new Skill(22, AllSkillEffects.SHIPYARD_MULTI),
      new Skill(23, AllSkillEffects.DOUBLE_MODDING),
      new Skill(24, AllSkillEffects.PLUS_METAL_MINER),
      new Skill(25, AllSkillEffects.PLUS_CRYSTAL_MINER),
      new Skill(26, AllSkillEffects.PLUS_ALLOY),
      new Skill(27, AllSkillEffects.PLUS_ENERGY),
      new Skill(29, AllSkillEffects.PLUS_CPU),
      new Skill(30, AllSkillEffects.PLUS_WORKER),
      new Skill(31, AllSkillEffects.PLUS_WARRIOR),
      new Skill(32, AllSkillEffects.PLUS_SEARCH),
      new Skill(33, AllSkillEffects.RESEARCH_MULTI),
      new Skill(34, AllSkillEffects.MODULE_LEVEL),
      new Skill(35, AllSkillEffects.DOUBLE_BATTLE_GAIN),
      new Skill(36, AllSkillEffects.DOUBLE_BATTLE_GAIN),
      new Skill(37, AllSkillEffects.DOUBLE_MISSILE),
      new Skill(38, AllSkillEffects.DOUBLE_MISSILE),
      new Skill(39, AllSkillEffects.DRONE_MULTI, true),
      new Skill(40, AllSkillEffects.DOUBLE_DARK_MATTER),
      new Skill(41, AllSkillEffects.DOUBLE_NAVAL_CAPACITY),
      new Skill(42, AllSkillEffects.FACTORY_BONUS),
      new Skill(43, AllSkillEffects.MOD_METAL_MINER),
      new Skill(44, AllSkillEffects.MOD_CRYSTAL_MINER),
      new Skill(45, AllSkillEffects.MOD_ALLOY),
      new Skill(46, AllSkillEffects.MOD_ENERGY),
      new Skill(47, AllSkillEffects.MOD_CPU),
      new Skill(48, AllSkillEffects.MOD_WORKER),
      new Skill(49, AllSkillEffects.MOD_SEARCH),
      new Skill(50, AllSkillEffects.SEARCH_HAB2),
      new Skill(51, AllSkillEffects.SEARCH_RANDOM),
      new Skill(52, AllSkillEffects.RESEARCH_MULTI),
      new Skill(53, AllSkillEffects.COMPUTING_MULTI),
      new Skill(54, AllSkillEffects.PLUS_SEARCH),
      new Skill(55, AllSkillEffects.PLUS_SEARCH),
      new Skill(56, AllSkillEffects.PLUS_SEARCH),
      new Skill(57, AllSkillEffects.DOUBLE_DISTRICTS),
      new Skill(58, AllSkillEffects.DOUBLE_DISTRICTS),
      new Skill(59, AllSkillEffects.DOUBLE_DISTRICTS),
      new Skill(60, AllSkillEffects.MULTI_FACTORY),
      new Skill(61, AllSkillEffects.MULTI_FACTORY),
      new Skill(62, AllSkillEffects.MULTI_FACTORY),
      new Skill(63, AllSkillEffects.MULTI_FACTORY),
      new Skill(64, AllSkillEffects.MULTI_FACTORY)
    ];
  }
  buySkill(skillId: number, fromSave = false): boolean {
    if (this.usedPrestige >= this.totalPrestige) return false;

    const skill = this.visSkills.get(skillId);
    if (skill.owned || (!skill.buyable && !fromSave)) return false;

    this.usedPrestige++;
    skill.owned = true;
    skill.color = OWNED_COLOR;
    const effect = AllSkillEffects.effectList.find(
      eff => eff.id === skill.effectId
    );
    const toAdd = Math.max(2 * this.ascension, 1);
    effect.numOwned += toAdd;
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
    this.visSkills.update(this.getDataset());
    this.usedPrestige = 0;
    AllSkillEffects.effectList.forEach(e => {
      e.numOwned = 0;
    });
  }

  //#region Save and Load
  getSave(): any {
    const save: any = {};
    if (this.ascension > 0) save.a = this.ascension;
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
    if ("a" in data) this.ascension = data.a;
    this.ascension = 2;
    if ("o" in data) {
      data.o.forEach(o => this.buySkill(o, true));
    }
    return true;
  }
  //#endregion
}

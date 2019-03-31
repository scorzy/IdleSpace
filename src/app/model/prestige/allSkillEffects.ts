import { SkillEffect } from "./skillEffects";
import { ResourceManager } from "../resource/resourceManager";

const PLUS_ADD = 1;

export class AllSkillEffects {
  static readonly PLUS_METAL_MINER = new SkillEffect();
  static readonly PLUS_CRYSTAL_MINER = new SkillEffect();
  static readonly PLUS_ENERGY = new SkillEffect();
  static readonly PLUS_ALLOY = new SkillEffect();
  static readonly PLUS_CPU = new SkillEffect();
  static readonly PLUS_WORKER = new SkillEffect();
  static readonly PLUS_SEARCH = new SkillEffect();
  static readonly PLUS_WARRIOR = new SkillEffect();

  static initialize() {
    const resMan = ResourceManager.getInstance();

    const tier1 = [
      AllSkillEffects.PLUS_METAL_MINER,
      AllSkillEffects.PLUS_CRYSTAL_MINER,
      AllSkillEffects.PLUS_ALLOY,
      AllSkillEffects.PLUS_ENERGY,
      AllSkillEffects.PLUS_CPU,
      AllSkillEffects.PLUS_WORKER,
      AllSkillEffects.PLUS_SEARCH
    ];
    for (let i = 0; i < 7; i++) {
      tier1[i].shape = resMan.materials[i].shape;
      tier1[i].getDescription = () => {
        return (
          "+" +
          PLUS_ADD +
          " " +
          resMan.tier1[i].name +
          " for " +
          resMan.tier1[i].actions[1].name
        );
      };
    }
  }
}

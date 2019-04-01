import { SkillEffect } from "./skillEffects";
import { ResourceManager } from "../resource/resourceManager";

export const PLUS_ADD = 5;
export class AllSkillEffects {
  static effectList = new Array<SkillEffect>();

  static readonly PLUS_METAL_MINER = new SkillEffect();
  static readonly PLUS_CRYSTAL_MINER = new SkillEffect();
  static readonly PLUS_ENERGY = new SkillEffect();
  static readonly PLUS_ALLOY = new SkillEffect();
  static readonly PLUS_CPU = new SkillEffect();
  static readonly PLUS_WORKER = new SkillEffect();
  static readonly PLUS_SEARCH = new SkillEffect();
  static readonly PLUS_WARRIOR = new SkillEffect();
  static readonly PLUS_BATTERY = new SkillEffect();

  static initialize() {
    const resMan = ResourceManager.getInstance();

    //#region Tier 1
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
      tier1[i].getDescription = (num = 1) => {
        return (
          "+" +
          PLUS_ADD * num +
          " " +
          resMan.tier1[i].name +
          " / " +
          resMan.tier1[i].actions[1].name
        );
      };
    }
    tier1.forEach(e => {
      e.afterBuy = () => {
        ResourceManager.getInstance().limitedResources.forEach(r =>
          r.reloadLimit()
        );
      };
    });
    //#endregion
    //#region PLUS_WARRIOR
    AllSkillEffects.PLUS_WARRIOR.shape = "ship";
    AllSkillEffects.PLUS_WARRIOR.getDescription = (num = 1) => {
      return (
        "+" +
        PLUS_ADD * num +
        " " +
        resMan.warriorX1.name +
        " / " +
        resMan.warriorX1.actions[1].name
      );
    };
    AllSkillEffects.PLUS_WARRIOR.afterBuy = () => {
      ResourceManager.getInstance().limitedResources.forEach(r =>
        r.reloadLimit()
      );
    };
    //#endregion
    //#region PLUS_BATTERY
    AllSkillEffects.PLUS_BATTERY.shape = "battery";
    AllSkillEffects.PLUS_BATTERY.getDescription = (num = 1) => {
      return "+ " + 100 * num + "% battery storage";
    };
    AllSkillEffects.PLUS_BATTERY.afterBuy = () => {
      ResourceManager.getInstance().limitedResources.forEach(r =>
        r.reloadLimit()
      );
    };
    //#endregion

    AllSkillEffects.effectList = [
      AllSkillEffects.PLUS_METAL_MINER,
      AllSkillEffects.PLUS_CRYSTAL_MINER,
      AllSkillEffects.PLUS_ALLOY,
      AllSkillEffects.PLUS_ENERGY,
      AllSkillEffects.PLUS_CPU,
      AllSkillEffects.PLUS_WORKER,
      AllSkillEffects.PLUS_SEARCH,
      AllSkillEffects.PLUS_WARRIOR,
      AllSkillEffects.PLUS_BATTERY
    ];
  }
}

import { SkillEffect } from "./skillEffects";
import { ResourceManager } from "../resource/resourceManager";
import { Bonus } from "../bonus/bonus";
import { Game } from "../game";
import { MainService } from "src/app/main.service";

export const PLUS_ADD = 10;
export class AllSkillEffects {
  static effectList = new Array<SkillEffect>();

  //#region Limit increase
  static readonly PLUS_METAL_MINER = new SkillEffect();
  static readonly PLUS_CRYSTAL_MINER = new SkillEffect();
  static readonly PLUS_ENERGY = new SkillEffect();
  static readonly PLUS_ALLOY = new SkillEffect();
  static readonly PLUS_CPU = new SkillEffect();
  static readonly PLUS_WORKER = new SkillEffect();
  static readonly PLUS_SEARCH = new SkillEffect();
  static readonly PLUS_WARRIOR = new SkillEffect();
  static readonly PLUS_BATTERY = new SkillEffect();
  static readonly DRONE_MULTI = new SkillEffect();
  //#endregion
  //#region Combat
  static readonly FAST_COMBAT = new SkillEffect();
  static readonly DOUBLE_NAVAL_CAPACITY = new SkillEffect();
  static readonly DOUBLE_DARK_MATTER = new SkillEffect();
  static readonly MODULE_LEVEL = new SkillEffect();
  static readonly DOUBLE_BATTLE_GAIN = new SkillEffect();
  static readonly DOUBLE_MISSILE = new SkillEffect();
  static readonly MULTI_FACTORY = new SkillEffect();
  //#endregion
  //#region Robot Modding
  static readonly FACTORY_BONUS = new SkillEffect();
  static readonly MODDING_PLUS = new SkillEffect();
  static readonly DOUBLE_MODDING = new SkillEffect();

  static readonly MOD_METAL_MINER = new SkillEffect();
  static readonly MOD_CRYSTAL_MINER = new SkillEffect();
  static readonly MOD_ENERGY = new SkillEffect();
  static readonly MOD_ALLOY = new SkillEffect();
  static readonly MOD_CPU = new SkillEffect();
  static readonly MOD_WORKER = new SkillEffect();
  static readonly MOD_SEARCH = new SkillEffect();
  static readonly MOD_WARRIOR = new SkillEffect();
  //#endregion
  //#region Search
  static readonly SEARCH_MULTI = new SkillEffect();
  static readonly SEARCH_METAL = new SkillEffect();
  static readonly SEARCH_CRY = new SkillEffect();
  static readonly SEARCH_HAB = new SkillEffect();
  static readonly SEARCH_HAB2 = new SkillEffect();
  static readonly SEARCH_RANDOM = new SkillEffect();
  static readonly DOUBLE_DISTRICTS = new SkillEffect();
  //#endregion
  //#region Resource Gain Multi
  static readonly ENERGY_MULTI = new SkillEffect();
  static readonly ALLOY_MULTI = new SkillEffect();
  static readonly COMPUTING_MULTI = new SkillEffect();
  static readonly SHIPYARD_MULTI = new SkillEffect();
  static readonly RESEARCH_MULTI = new SkillEffect();
  //#endregion

  static initialize(prestige = false) {
    const resMan = ResourceManager.getInstance();

    //#region Tier 1
    const resources = [
      resMan.metal,
      resMan.crystal,
      resMan.energy,
      resMan.computing,
      resMan.alloy,
      resMan.shipyardProgress,
      resMan.searchProgress
    ];
    const workers = [
      resMan.metalX1,
      resMan.crystalX1,
      resMan.energyX1,
      resMan.computingX1,
      resMan.alloyX1,
      resMan.shipyardX1,
      resMan.searchX1
    ];
    const tier1 = [
      AllSkillEffects.PLUS_METAL_MINER,
      AllSkillEffects.PLUS_CRYSTAL_MINER,
      AllSkillEffects.PLUS_ENERGY,
      AllSkillEffects.PLUS_CPU,
      AllSkillEffects.PLUS_ALLOY,
      AllSkillEffects.PLUS_WORKER,
      AllSkillEffects.PLUS_SEARCH
    ];
    const mods = [
      AllSkillEffects.MOD_METAL_MINER,
      AllSkillEffects.MOD_CRYSTAL_MINER,
      AllSkillEffects.MOD_ENERGY,
      AllSkillEffects.MOD_CPU,
      AllSkillEffects.MOD_ALLOY,
      AllSkillEffects.MOD_WORKER,
      AllSkillEffects.MOD_SEARCH
    ];
    AllSkillEffects.DRONE_MULTI.getDescription = (num = 1) => {
      return (
        "Drones yield and consume\n" +
        MainService.formatPipe.transform(150 * num) +
        "% more resource"
      );
    };
    AllSkillEffects.DRONE_MULTI.name = "Drone Prestige";
    for (let i = 0; i < 7; i++) {
      tier1[i].shape = resources[i].shape;
      tier1[i].getDescription = (num = 1) => {
        return (
          "+" +
          MainService.formatPipe.transform(PLUS_ADD * num) +
          " " +
          workers[i].name +
          "\n / " +
          workers[i].actions[1].name +
          "\n " +
          MainService.formatPipe.transform(50 * num) +
          "% " +
          workers[i].name +
          " output"
        );
      };
      tier1[i].name = workers[i].name + " Prestige";
      workers[i].productionMultiplier.multiplicativeBonus.push(
        new Bonus(tier1[i], 0.5, true)
      );
      workers[i].productionMultiplier.multiplicativeBonus.push(
        new Bonus(AllSkillEffects.DRONE_MULTI, 1.5)
      );

      mods[i].getDescription = (num = 1) => {
        return (
          "+ " +
          MainService.formatPipe.transform(10 * num) +
          " " +
          workers[i].name +
          " mods"
        );
      };
      workers[i].modPrestige = mods[i];
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
        MainService.formatPipe.transform(PLUS_ADD * num) +
        " " +
        resMan.warriorX1.name +
        "\n / " +
        resMan.warriorX1.actions[1].name
      );
    };
    AllSkillEffects.PLUS_WARRIOR.afterBuy = () => {
      ResourceManager.getInstance().limitedResources.forEach(r =>
        r.reloadLimit()
      );
    };
    //#endregion
    //#region Combat
    AllSkillEffects.FAST_COMBAT.shape = "clock";
    AllSkillEffects.FAST_COMBAT.getDescription = (num = 1) => {
      return "- " + MainService.formatPipe.transform(0.3 * num) + "s fight time";
    };
    AllSkillEffects.DOUBLE_NAVAL_CAPACITY.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(50 * num) + "%\nnaval capacity"
      );
    };
    AllSkillEffects.DOUBLE_DARK_MATTER.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(200 * num) + "%\nDark Matter"
      );
    };
    AllSkillEffects.MODULE_LEVEL.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(200 * num) +
        "%\nShip Module Level"
      );
    };
    AllSkillEffects.DOUBLE_BATTLE_GAIN.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(200 * num) +
        "%\nResource gain from battle"
      );
    };
    AllSkillEffects.DOUBLE_MISSILE.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(250 * num) +
        "%\nDamage from missiles"
      );
    };
    AllSkillEffects.DOUBLE_MISSILE.name = "Missile Prestige";
    AllSkillEffects.MULTI_FACTORY.getDescription = (num = 1) => {
      return (
        "%Missile Factory yield and consume\n" +
        MainService.formatPipe.transform(250 * num) +
        "% more resource."
      );
    };
    AllSkillEffects.DOUBLE_MISSILE.name = "Missile Factory Prestige";
    resMan.missileX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.DOUBLE_MISSILE, 2.5)
    );
    //#endregion
    //#region Robot Modding
    AllSkillEffects.FACTORY_BONUS.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(500 * num) +
        "%\n" +
        resMan.droneFactory.name +
        " output"
      );
    };
    ResourceManager.getInstance().droneFactory.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.FACTORY_BONUS, 5, true)
    );
    AllSkillEffects.MODDING_PLUS.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(5 * num) + "\n Modding points"
      );
    };
    AllSkillEffects.DOUBLE_MODDING.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(100 * num) +
        "%\n Modding points"
      );
    };
    //#endregion
    //#region Search
    AllSkillEffects.SEARCH_MULTI.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(300 * num) + "%\n Searching"
      );
    };
    AllSkillEffects.SEARCH_MULTI.name = "Prestige search multi";
    resMan.searchX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.SEARCH_MULTI, 3, true)
    );

    AllSkillEffects.SEARCH_METAL.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num) +
        "% Searching\ncan search for metal district"
      );
    };
    AllSkillEffects.SEARCH_METAL.name = "Prestige search metal";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_METAL, 0.5, true)
    );

    AllSkillEffects.SEARCH_CRY.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num) +
        "% Searching\ncan search for crystal district"
      );
    };
    AllSkillEffects.SEARCH_CRY.name = "Prestige search crystal";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_CRY, 0.5, true)
    );

    AllSkillEffects.SEARCH_HAB.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num) +
        "% Searching\ncan search for habitable space"
      );
    };
    AllSkillEffects.SEARCH_HAB.name = "Prestige search habitable space";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_HAB, 0.5, true)
    );

    AllSkillEffects.SEARCH_HAB2.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num) +
        "% Searching\ncan search for even more habitable space"
      );
    };
    AllSkillEffects.SEARCH_HAB2.name = "Prestige search habitable space 2";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_HAB2, 0.5, true)
    );

    AllSkillEffects.SEARCH_RANDOM.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(50 * num) +
        "% Searching\ncan search for randomized districts"
      );
    };
    AllSkillEffects.SEARCH_RANDOM.name = "Prestige search random";
    resMan.searchX1.productionMultiplier.additiveBonus.push(
      new Bonus(AllSkillEffects.SEARCH_HAB2, 0.5, true)
    );

    AllSkillEffects.DOUBLE_DISTRICTS.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(100 * num) + " districts gain"
      );
    };
    //#endregion
    //#region Gain Multi
    AllSkillEffects.ENERGY_MULTI.getDescription = (num = 1) => {
      return "+ " + MainService.formatPipe.transform(200 * num) + "%\n Energy";
    };
    AllSkillEffects.ENERGY_MULTI.name = "Prestige energy multi";
    resMan.energyX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.ENERGY_MULTI, 2, true)
    );

    AllSkillEffects.ALLOY_MULTI.getDescription = (num = 1) => {
      return "+ " + MainService.formatPipe.transform(200 * num) + "%\n Alloy";
    };
    AllSkillEffects.ALLOY_MULTI.name = "Prestige alloy multi";
    resMan.alloyX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.ALLOY_MULTI, 2, true)
    );

    AllSkillEffects.COMPUTING_MULTI.getDescription = (num = 1) => {
      return (
        "+ " + MainService.formatPipe.transform(200 * num) + "%\n Computing"
      );
    };
    AllSkillEffects.COMPUTING_MULTI.name = "Prestige computing multi";
    resMan.computingX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.COMPUTING_MULTI, 2, true)
    );

    AllSkillEffects.SHIPYARD_MULTI.getDescription = (num = 1) => {
      return (
        "+ " +
        MainService.formatPipe.transform(200 * num) +
        "%\n Shipyard Progress"
      );
    };
    AllSkillEffects.SHIPYARD_MULTI.name = "Prestige Shipyard Progress multi";
    resMan.shipyardX1.productionMultiplier.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.SHIPYARD_MULTI, 2, true)
    );

    AllSkillEffects.RESEARCH_MULTI.getDescription = (num = 1) => {
      return "+ " + MainService.formatPipe.transform(400 * num) + "%\n Research";
    };
    AllSkillEffects.RESEARCH_MULTI.name = "Prestige Research multi";
    Game.getInstance().researchBonus.multiplicativeBonus.push(
      new Bonus(AllSkillEffects.RESEARCH_MULTI, 4, true)
    );
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
      AllSkillEffects.FAST_COMBAT,
      AllSkillEffects.DOUBLE_NAVAL_CAPACITY,
      AllSkillEffects.FACTORY_BONUS,
      AllSkillEffects.MODDING_PLUS,
      AllSkillEffects.SEARCH_MULTI,
      AllSkillEffects.SEARCH_METAL,
      AllSkillEffects.SEARCH_CRY,
      AllSkillEffects.SEARCH_HAB,
      AllSkillEffects.DOUBLE_DARK_MATTER,
      AllSkillEffects.ENERGY_MULTI,
      AllSkillEffects.ALLOY_MULTI,
      AllSkillEffects.COMPUTING_MULTI,
      AllSkillEffects.SHIPYARD_MULTI,
      AllSkillEffects.DOUBLE_MODDING,
      AllSkillEffects.RESEARCH_MULTI,
      AllSkillEffects.MODULE_LEVEL,
      AllSkillEffects.DOUBLE_BATTLE_GAIN,
      AllSkillEffects.DOUBLE_MISSILE,
      AllSkillEffects.DRONE_MULTI,
      AllSkillEffects.MOD_METAL_MINER,
      AllSkillEffects.MOD_CRYSTAL_MINER,
      AllSkillEffects.MOD_ENERGY,
      AllSkillEffects.MOD_CPU,
      AllSkillEffects.MOD_ALLOY,
      AllSkillEffects.MOD_WORKER,
      AllSkillEffects.MOD_SEARCH,
      AllSkillEffects.SEARCH_HAB2,
      AllSkillEffects.SEARCH_RANDOM,
      AllSkillEffects.DOUBLE_DISTRICTS,
      AllSkillEffects.MULTI_FACTORY
    ];
    if (!prestige) {
      AllSkillEffects.effectList.forEach(e => {
        e.numOwned = 0;
        e.label = e.getDescription(1);
      });
    }
  }
}

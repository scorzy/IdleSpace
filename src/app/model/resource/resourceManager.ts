import { Resource } from "./resource";
import { ISalvable } from "../base/ISalvable";
import isArray from "lodash-es/isArray";
import { ResourceGroup } from "./resourceGroup";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";
import { Action } from "../actions/abstractAction";
import { Shipyard } from "../shipyard/shipyard";
import { EnemyManager } from "../enemy/enemyManager";
import { MainService } from "src/app/main.service";
import { FleetManager } from "../fleet/fleetManager";
import { AllSkillEffects } from "../prestige/allSkillEffects";
import { ModStack } from "../mod/modStack";
import { ResearchManager } from "../research/researchManager";
import { OptionsService } from "src/app/options.service";
import { Bonus } from "../bonus/bonus";

const MINE_EXP = 1.5;
const BUILDING_EXP = 2;

export class ResourceManager implements ISalvable {
  private static instance: ResourceManager;

  unlockedResources: Resource[];
  unlockedProdResources: Resource[];
  limitedResources: Resource[];
  allResources: Resource[];
  tierGroups: ResourceGroup[];
  unlockedTierGroups: ResourceGroup[];

  //#region Resources
  metal: Resource;
  crystal: Resource;
  alloy: Resource;
  energy: Resource;
  computing: Resource;
  habitableSpace: Resource;
  miningDistrict: Resource;
  crystalDistrict: Resource;
  droneFactory: Resource;
  drone: Resource;
  navalCap: Resource;
  inactiveDarkMatter: Resource;
  missile: Resource;

  metalX1: Resource;
  crystalX1: Resource;
  alloyX1: Resource;
  energyX1: Resource;
  computingX1: Resource;
  shipyardX1: Resource;
  shipyardProgress: Resource;
  searchX1: Resource;
  searchProgress: Resource;
  warriorX1: Resource;
  missileX1: Resource;

  metalM: Resource;
  crystalM: Resource;
  energyM: Resource;
  // #endregion
  //#region group
  materials: Resource[];
  districts: Resource[];
  matGroup: ResourceGroup;
  tier1: Resource[];
  tier2: Resource[];
  matNav: Resource[];

  limited: Resource[];
  //#endregion

  unitZero: Resource;
  maxTime: number = Number.POSITIVE_INFINITY;

  constructor() {
    ResourceManager.instance = this;

    //#region Materials
    this.metal = new Resource("m");
    this.metal.shape = "metal";
    this.metal.unlocked = true;

    this.crystal = new Resource("c");
    this.crystal.shape = "crystal";
    this.crystal.unlocked = true;

    this.alloy = new Resource("a");
    this.alloy.shape = "alloy";

    this.energy = new Resource("e");
    this.energy.shape = "energy";
    this.energy.isLimited = true;
    this.energy.workerPerMine = new Decimal(100);

    this.computing = new Resource("f");
    this.computing.shape = "computing";

    this.shipyardProgress = new Resource("SP");
    this.shipyardProgress.shape = "cog";

    this.searchProgress = new Resource("XP");
    this.searchProgress.shape = "radar";

    this.navalCap = new Resource("n");
    this.navalCap.shape = "ship";

    this.inactiveDarkMatter = new Resource("d");
    this.inactiveDarkMatter.shape = "darkMatter";

    this.metalM = new Resource("mM");
    this.crystalM = new Resource("cM");
    this.energyM = new Resource("eM");

    this.missile = new Resource("i");
    this.missile.shape = "missile";
    //#endregion
    //#region Declarations

    //      Metal
    this.metalX1 = new Resource("m1");
    this.metalX1.unlocked = true;
    this.metalX1.quantity = new Decimal(1);
    this.metal.addGenerator(this.metalX1);
    this.energy.addGenerator(this.metalX1, -1);

    //      Crystal
    this.crystalX1 = new Resource("c1");
    this.crystalX1.unlocked = true;
    this.crystalX1.quantity = new Decimal(1);
    this.crystal.addGenerator(this.crystalX1, 0.7);
    this.energy.addGenerator(this.crystalX1, -1);

    //      Alloy
    this.alloyX1 = new Resource("a1");
    this.alloy.addGenerator(this.alloyX1);
    this.metal.addGenerator(this.alloyX1, -3);
    this.crystal.addGenerator(this.alloyX1, -2);
    this.energy.addGenerator(this.alloyX1, -1);

    //      Energy
    this.energy.unlocked = true;
    this.energy.quantity = new Decimal(1);
    this.energyX1 = new Resource("e1");
    this.energyX1.unlocked = true;
    this.energyX1.quantity = new Decimal(3);
    this.energy.addGenerator(this.energyX1);

    //      Computing
    this.computingX1 = new Resource("f1");
    this.computing.addGenerator(this.computingX1);
    this.energy.addGenerator(this.computingX1, -1);

    //      Shipyard
    this.shipyardX1 = new Resource("S1");
    this.shipyardProgress.addGenerator(this.shipyardX1);
    this.alloy.addGenerator(this.shipyardX1, -1);
    this.energy.addGenerator(this.shipyardX1, -1);

    //      Search
    this.searchX1 = new Resource("X1");
    this.searchProgress.addGenerator(this.searchX1);
    this.energy.addGenerator(this.searchX1, -1);
    this.computing.addGenerator(this.searchX1, -1);

    //      Warrior
    this.warriorX1 = new Resource("W1");
    this.navalCap.addGenerator(this.warriorX1);
    this.energy.addGenerator(this.warriorX1, -0.5);
    this.computing.addGenerator(this.warriorX1, -0.5);

    //  Drone
    this.drone = new Resource("D");
    this.drone.shape = "robot";
    this.drone.workerPerMine = new Decimal(50);
    this.droneFactory = new Resource("F");
    this.drone.addGenerator(this.droneFactory, 0.01);
    this.alloy.addGenerator(this.droneFactory, -100);
    this.energy.addGenerator(this.droneFactory, -20);

    //      Missile
    this.missileX1 = new Resource("i1");
    this.missile.addGenerator(this.missileX1, 0.01);
    this.alloy.addGenerator(this.missileX1, -2);
    this.energy.addGenerator(this.missileX1, -1);

    //      Space
    this.habitableSpace = new Resource("hs");
    this.habitableSpace.shape = "world";
    this.miningDistrict = new Resource("md");
    this.miningDistrict.shape = "miningD";
    this.crystalDistrict = new Resource("cd");
    this.crystalDistrict.shape = "crystalD";
    this.districts = [
      this.habitableSpace,
      this.miningDistrict,
      this.crystalDistrict
    ];
    this.districts.forEach(d => {
      d.unlocked = true;
    });

    //#endregion
    //#region Group
    this.materials = [
      this.metal,
      this.crystal,
      this.energy,
      this.computing,
      this.alloy,
      this.shipyardProgress,
      this.searchProgress,
      this.drone,
      this.navalCap,
      this.missile
    ];
    this.tier1 = [
      this.metalX1,
      this.crystalX1,
      this.energyX1,
      this.computingX1,
      this.alloyX1,
      this.shipyardX1,
      this.warriorX1,
      this.searchX1
    ];
    this.tier2 = [
      this.droneFactory,
      this.metalM,
      this.crystalM,
      this.energyM,
      this.missileX1
    ];
    //#endregion
    //#region Buy
    this.metalX1.generateBuyAction(
      new MultiPrice([new Price(this.metal, 80), new Price(this.crystal, 20)])
    );
    this.crystalX1.generateBuyAction(
      new MultiPrice([new Price(this.metal, 80), new Price(this.crystal, 40)])
    );
    this.metalX1.buyAction.afterBuy = this.unlockComputing.bind(this);
    this.crystalX1.buyAction.afterBuy = this.unlockComputing.bind(this);

    this.alloyX1.generateBuyAction(
      new MultiPrice([new Price(this.metal, 80), new Price(this.crystal, 60)])
    );
    this.energyX1.generateBuyAction(
      new MultiPrice([new Price(this.metal, 80), new Price(this.crystal, 60)])
    );
    this.computingX1.generateBuyAction(
      new MultiPrice([new Price(this.metal, 60), new Price(this.crystal, 120)])
    );
    this.shipyardX1.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 50),
        new Price(this.metal, 100),
        new Price(this.crystal, 25)
      ])
    );
    this.searchX1.generateBuyAction(
      new MultiPrice([new Price(this.alloy, 100), new Price(this.crystal, 200)])
    );
    this.warriorX1.generateBuyAction(
      new MultiPrice([new Price(this.alloy, 200)])
    );

    //
    //  Buildings
    //
    this.droneFactory.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.habitableSpace, 1, BUILDING_EXP)
      ])
    );
    this.missileX1.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.habitableSpace, 1, BUILDING_EXP)
      ])
    );
    this.metalM.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.crystal, 1e4, BUILDING_EXP),
        new Price(this.habitableSpace, 10, BUILDING_EXP)
      ])
    );
    this.metalX1.productionMultiplier.additiveBonus.push(
      new Bonus(this.metalM, 1, true)
    );
    this.crystalM.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.crystal, 1e4, BUILDING_EXP),
        new Price(this.habitableSpace, 10, BUILDING_EXP)
      ])
    );
    this.crystalX1.productionMultiplier.additiveBonus.push(
      new Bonus(this.crystalM, 1, true)
    );
    this.energyM.generateBuyAction(
      new MultiPrice([
        new Price(this.alloy, 1e3, BUILDING_EXP),
        new Price(this.crystal, 1e4, BUILDING_EXP),
        new Price(this.habitableSpace, 10, BUILDING_EXP)
      ])
    );
    this.energyX1.productionMultiplier.additiveBonus.push(
      new Bonus(this.energyM, 1, true)
    );

    //#endregion
    //#region Mine
    //  Metal Mine
    const buyMetalMine = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 1000, MINE_EXP),
        new Price(this.crystal, 250, MINE_EXP),
        new Price(this.miningDistrict, 1, MINE_EXP)
      ])
    );
    buyMetalMine.afterBuy = () => {
      this.metalX1.reloadLimit();
    };
    buyMetalMine.name = "Metal Mine";
    this.metalX1.actions.push(buyMetalMine);
    this.metalX1.limitStorage = buyMetalMine;
    this.metalX1.prestigeLimit = AllSkillEffects.PLUS_METAL_MINER;

    //  Crystal Mine
    const buyCrystalMine = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 1000, MINE_EXP),
        new Price(this.crystal, 500, MINE_EXP),
        new Price(this.crystalDistrict, 1, MINE_EXP)
      ])
    );
    buyCrystalMine.afterBuy = () => {
      this.crystalX1.reloadLimit();
    };
    buyCrystalMine.name = "Crystal Mine";
    this.crystalX1.actions.push(buyCrystalMine);
    this.crystalX1.limitStorage = buyCrystalMine;
    this.crystalX1.prestigeLimit = AllSkillEffects.PLUS_CRYSTAL_MINER;

    //  Energy Plant
    const buyEnergyPlant = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 1500, MINE_EXP),
        new Price(this.crystal, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyEnergyPlant.afterBuy = () => {
      this.energyX1.reloadLimit();
    };
    buyEnergyPlant.name = "Energy Plant";
    this.energyX1.actions.push(buyEnergyPlant);
    this.energyX1.limitStorage = buyEnergyPlant;
    this.energyX1.prestigeLimit = AllSkillEffects.PLUS_ENERGY;

    //  Supercomputer
    const buySuperComputer = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 1500, MINE_EXP),
        new Price(this.crystal, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buySuperComputer.afterBuy = () => {
      this.computingX1.reloadLimit();
    };
    buySuperComputer.name = "Super Computer";
    this.computingX1.actions.push(buySuperComputer);
    this.computingX1.limitStorage = buySuperComputer;
    this.computingX1.prestigeLimit = AllSkillEffects.PLUS_CPU;

    //  Alloy Foundry
    const buyFoundry = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 1000, MINE_EXP),
        new Price(this.crystal, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyFoundry.afterBuy = () => {
      this.alloyX1.reloadLimit();
    };
    buyFoundry.name = "Alloy Foundry";
    this.alloyX1.actions.push(buyFoundry);
    this.alloyX1.limitStorage = buyFoundry;
    this.alloyX1.prestigeLimit = AllSkillEffects.PLUS_ALLOY;

    //  Shipyard
    const buyShipyard = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 1000, MINE_EXP),
        new Price(this.crystal, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyShipyard.afterBuy = () => {
      this.shipyardX1.reloadLimit();
    };
    buyShipyard.name = "Shipyard";
    this.shipyardX1.actions.push(buyShipyard);
    this.shipyardX1.limitStorage = buyShipyard;
    this.shipyardX1.prestigeLimit = AllSkillEffects.PLUS_WORKER;

    this.shipyardProgress.reloadLimit = () => {
      const shipyard = Shipyard.getInstance();
      if (shipyard) {
        this.shipyardProgress.limit = shipyard.getTotalToDo();
        this.shipyardProgress.quantity = this.shipyardProgress.quantity.min(
          this.shipyardProgress.limit
        );
      }
      this.shipyardProgress.isCapped = this.shipyardProgress.limit.lt(0);
    };

    //  Searching
    const buyTelescope = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 1000, MINE_EXP),
        new Price(this.crystal, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyTelescope.afterBuy = () => {
      this.searchX1.reloadLimit();
    };
    buyTelescope.name = "Telescope";
    this.searchX1.actions.push(buyTelescope);
    this.searchX1.limitStorage = buyTelescope;
    this.searchX1.prestigeLimit = AllSkillEffects.PLUS_SEARCH;

    this.searchProgress.reloadLimit = () => {
      const enemy = EnemyManager.getInstance();
      if (enemy) {
        this.searchProgress.limit = enemy.getTotalToDo();
        this.searchProgress.quantity = this.searchProgress.quantity.min(
          this.searchProgress.limit
        );
      }
      this.searchProgress.isCapped = this.searchProgress.limit.lt(0);
    };

    //  Warrior
    const buyStronghold = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 1000, MINE_EXP),
        new Price(this.crystal, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyStronghold.afterBuy = () => {
      this.warriorX1.reloadLimit();
    };
    buyStronghold.name = "Stronghold";
    this.warriorX1.actions.push(buyStronghold);
    this.warriorX1.limitStorage = buyStronghold;
    this.warriorX1.prestigeLimit = AllSkillEffects.PLUS_WARRIOR;

    //  Drone
    const buyDrone = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 1000, MINE_EXP),
        new Price(this.crystal, 1000, MINE_EXP),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyDrone.afterBuy = () => {
      this.drone.reloadLimit();
    };
    buyDrone.name = "Drone Depot";
    this.drone.exponentialStorage = true;
    this.drone.actions.push(buyDrone);
    this.drone.limitStorage = buyDrone;
    this.drone.reloadCustomLimit = (limit: Decimal) => {
      return limit.plus(
        !this.tierGroups
          ? new Decimal(0)
          : this.tierGroups[1].unlockedResources
              .filter(r => !r.isCapped && r !== this.drone)
              .map(r => r.limit.minus(r.quantity))
              .reduce((c, p) => c.plus(p), new Decimal(0))
      );
    }

    //#endregion
    //#region Storage
    ;[this.metal, this.crystal, this.alloy].forEach(m => {
      m.isLimited = true;
      const buyExpansion1 = new Action(
        "L",
        new MultiPrice([
          new Price(m, 900, 2),
          new Price(this.habitableSpace, 1, MINE_EXP)
        ])
      );
      buyExpansion1.afterBuy = () => {
        m.reloadLimit();
      };
      buyExpansion1.name = m.name + " Storage";
      m.actions.push(buyExpansion1);
      m.limitStorage = buyExpansion1;
      m.exponentialStorage = true;
      m.alwaysActive = true;
      m.workerPerMine = new Decimal(1000);
    });

    //  Energy
    this.energy.isLimited = true;
    const buyExpansion = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 500, 2),
        new Price(this.crystal, 1000, 2),
        new Price(this.habitableSpace, 1, MINE_EXP)
      ])
    );
    buyExpansion.afterBuy = () => {
      this.energy.reloadLimit();
    };
    buyExpansion.name = "Batteries";
    this.energy.actions.push(buyExpansion);
    this.energy.limitStorage = buyExpansion;
    this.energy.exponentialStorage = true;
    this.energy.alwaysActive = true;
    this.energy.workerPerMine = new Decimal(200);

    //  Missile
    this.missile.isLimited = true;
    const missileSilo = new Action(
      "L",
      new MultiPrice([
        new Price(this.metal, 5000, 2),
        new Price(this.crystal, 10000, 2),
        new Price(this.habitableSpace, 5, MINE_EXP)
      ])
    );
    missileSilo.afterBuy = () => {
      this.missile.reloadLimit();
    };
    missileSilo.name = "Missile Silo";
    this.missile.actions.push(missileSilo);
    this.missile.limitStorage = missileSilo;
    this.missile.exponentialStorage = true;
    this.missile.workerPerMine = new Decimal(10);
    //#endregion
    //#region Arrays
    this.limited = [
      this.metal,
      this.crystal,
      this.alloy,
      this.metalX1,
      this.crystalX1,
      this.alloyX1,
      this.energyX1,
      this.computingX1,
      this.energy,
      this.shipyardProgress,
      this.shipyardX1,
      this.searchX1,
      this.searchProgress,
      this.warriorX1,
      this.drone,
      this.missile
    ];
    this.limited.forEach(rl => {
      rl.isLimited = true;
      rl.reloadLimit();
    });

    this.allResources = [
      this.metal,
      this.crystal,
      this.alloy,
      this.energy,
      this.computing,
      this.metalX1,
      this.crystalX1,
      this.energyX1,
      this.alloyX1,
      this.computingX1,
      this.habitableSpace,
      this.miningDistrict,
      this.crystalDistrict,
      this.shipyardX1,
      this.shipyardProgress,
      this.searchX1,
      this.searchProgress,
      this.warriorX1,
      this.drone,
      this.droneFactory,
      this.navalCap,
      this.inactiveDarkMatter,
      this.metalM,
      this.crystalM,
      this.energyM,
      this.missile,
      this.missileX1
    ];
    this.allResources.forEach(r => r.generateRefundActions());
    this.matGroup = new ResourceGroup(
      "0",
      "Materials",
      "objects",
      this.materials
    );
    this.tierGroups = [
      this.matGroup,
      new ResourceGroup("1", "Robots", "robot", this.tier1),
      new ResourceGroup("2", "Buildings", "building", this.tier2),
      new ResourceGroup("4", "Districts", "world", this.districts)
    ];
    this.tierGroups[0].action1Name = "Buy Storage";
    this.tierGroups[1].action1Name = "Buy Robots";
    this.tierGroups[1].action2Name = "Increase Robot Storage";
    this.tierGroups[2].action1Name = "Buy Buildings";

    this.tier1.forEach(t => {
      t.showPriority = true;
    });

    this.reloadList();
    //#endregion
    //#region Info Messages
    this.metalX1.alerts = [
      {
        id: "1",
        getType: () => "info",
        getMessage: () => "Buy five or more to unlock new stuff",
        getCondition: () => ResourceManager.getInstance().metalX1.quantity.lt(5)
      }
    ];
    this.crystalX1.alerts = [
      {
        id: "2",
        getType: () => "info",
        getMessage: () => "Buy five or more to unlock new stuff",
        getCondition: () =>
          ResourceManager.getInstance().crystalX1.quantity.lt(5)
      }
    ];
    this.warriorX1.alerts = [
      {
        id: "3",
        getType: () => "info",
        getMessage: () =>
          ResourceManager.getInstance().warriorX1.name +
          " are granting + " +
          MainService.formatPipe.transform(
            FleetManager.getInstance().getNavalCapacityFromDrones(),
            true
          ) +
          " naval capacity",
        getCondition: () =>
          ResourceManager.getInstance().warriorX1.quantity.gte(1)
      }
    ];
    //#endregion
    //#region Mods
    this.tier1.forEach(r => {
      r.modStack = new ModStack();
      r.modStack.generateMods(r);
    });
    //#endregion
  }
  static getInstance() {
    return ResourceManager.instance;
  }
  /**
   *  Reload lists of unlocked resources
   */
  reloadList(): void {
    this.unlockedResources = this.allResources.filter(r => r.unlocked);
    this.unlockedProdResources = this.unlockedResources.filter(
      r => r.generators.length > 0 || r.products.length > 0
    );
    this.limitedResources = this.limited.filter(r => r.unlocked);
    this.tierGroups.forEach(tg => tg.reload());
    this.unlockedTierGroups = this.tierGroups.filter(
      u => u.unlockedResources.length > 0
    );
    this.matNav = [
      this.metal,
      this.crystal,
      this.alloy,
      this.energy,
      this.computing
    ].filter(m => m.unlocked);
  }
  /**
   *  Calculate polynomial grow
   */
  loadPolynomial(): void {
    this.shipyardProgress.reloadLimit();
    this.searchProgress.reloadLimit();
    this.unlockedProdResources.forEach(res => {
      res.reloadProd();
    });

    for (const unit of this.unlockedProdResources) {
      unit.c = new Decimal(0);

      for (const prod1 of unit.generators.filter(p => p.producer.isActive())) {
        const prodX = prod1.prodPerSec;
        unit.c = unit.c.plus(prodX.times(prod1.producer.quantity));
      }
    }
  }
  /**
   *  Calculate times to end
   */
  loadEndTime(): number {
    this.maxTime = Number.POSITIVE_INFINITY;
    this.unitZero = null;

    //  Reset
    this.unlockedProdResources.forEach(unit => {
      unit.endIn = Number.POSITIVE_INFINITY;
      unit.isEnding = false;
      unit.fullIn = Number.POSITIVE_INFINITY;
    });

    //  Load end times
    this.unlockedProdResources.forEach(unit => {
      const d = unit.quantity;
      if (unit.c.lt(0)) {
        const min = d.div(unit.c.abs()).max(0);
        if (this.maxTime > min.toNumber()) {
          this.maxTime = min.toNumber();
          this.unitZero = unit;
        }
        unit.endIn = Math.min(min.times(1000).toNumber(), unit.endIn);
        unit.isEnding = true;
      }
    });

    //  Load full times
    this.limitedResources
      .filter(r => !r.isCapped && !r.isEnding)
      .forEach(unit => {
        const d = unit.limit.minus(unit.quantity);
        if (unit.c.gt(0)) {
          const min = d.div(unit.c);
          if (this.maxTime > min.toNumber()) {
            this.maxTime = min.toNumber();
            this.unitZero = unit;
          }
          unit.fullIn = Math.min(min.times(1000).toNumber(), unit.fullIn);
        }
      });

    //  Fix Computing
    if (this.unitZero === this.computing && this.computing.c.gte(0)) {
      this.maxTime = Number.POSITIVE_INFINITY;
      this.computing.isEnding = false;
      this.unitZero = null;
    }

    // console.log(
    //   this.unitZero.name +
    //     " " +
    //     this.unitZero.endIn +
    //     " " +
    //     this.unitZero.fullIn
    // );
    return this.maxTime;
  }
  /**
   * Update resources
   *
   * @param  seconds in seconds
   */
  update(seconds: number): void {
    this.unlockedResources
      .filter(u => !u.c.eq(0))
      .forEach(u => {
        u.quantity = u.quantity.plus(u.c.times(seconds));
      });
    this.unlockedResources
      .filter(u => u.quantity.lt(0))
      .forEach(u => {
        // u.quantity = new Decimal(0);
      });
  }
  /**
   * Stop consumers and producers of consumers of resource that have been ended
   */
  stopResource() {
    if (this.unitZero && this.unitZero.isEnding) {
      //  Stop consumers
      this.unitZero.generators
        .filter(p => p.producer.quantity.gt(0) && p.ratio.lt(0))
        .forEach(p => {
          p.producer.operativity = 0;
        });
      this.unitZero.isEnding = false;
    }
    if (this.unitZero && !this.unitZero.isEnding) {
      this.unitZero.isCapped = true;
    }
  }
  /**
   *  Reload prices and what player can buy
   */
  reloadActions() {
    this.unlockedResources.forEach(res => {
      res.actions.forEach(act => act.reload());
    });
  }

  /**
   *  Unlock computing if metalX1 and crystalX1 are >=5
   */
  unlockComputing() {
    if (
      !this.computing.unlocked &&
      this.metalX1.quantity.gte(5) &&
      this.crystalX1.quantity.gte(5)
    ) {
      const unl = this.computing.unlock();
      this.computingX1.unlock();
      if (unl) {
        ResearchManager.getInstance().isNew = true;
        if (OptionsService.researchModal) {
          ResearchManager.getInstance().isNewModal = true;
        }
        MainService.toastr.info("Research tab unlocked");
      }
    }
  }

  /**
   * Deploy drones to works
   * Based on priority
   */
  deployDrones() {
    const jobs = this.tierGroups[1].unlockedResources.filter(
      j => !j.isCapped && j !== this.drone
    );
    jobs.forEach(j => {
      j.realPriority = j.limit
        .minus(j.quantity)
        .floor()
        .times(j.priority);
    });
    const totalPriority = jobs
      .map(j => j.realPriority)
      .reduce((p, c) => p.plus(c), new Decimal());
    jobs.sort((a, b) => b.realPriority.cmp(a.realPriority));
    let toDeploy = this.drone.quantity;
    let n = 0;
    while (toDeploy.gte(0) && n < jobs.length) {
      const job = jobs[n];
      const toAddMax = job.limit.minus(job.quantity).floor();
      const toAddPrior = toDeploy
        .times(job.realPriority)
        .div(job.standardPrice)
        .div(totalPriority)
        .floor();
      const toAdd = Decimal.min(toAddMax, toAddPrior).floor();
      if (toAdd.gte(1)) {
        job.quantity = job.quantity.plus(toAdd);
        const price = toAdd.times(job.standardPrice);
        toDeploy = toDeploy.minus(price);
        this.drone.quantity = this.drone.quantity.minus(price);
      }
      n++;
    }
    //  If everything round to zero no robots are deployed
    //  I fix this by deploy on high priority job
    n = 0;
    while (toDeploy.gte(0) && n < jobs.length) {
      const job = jobs[n];
      const toAddMax = job.limit.minus(job.quantity).floor();
      const toAdd = toAddMax
        .div(job.standardPrice)
        .min(toDeploy.div(job.standardPrice))
        .floor();
      if (toAdd.gte(1)) {
        job.quantity = job.quantity.plus(toAdd);
        const price = toAdd.times(job.standardPrice);
        toDeploy = toDeploy.minus(price);
        this.drone.quantity = this.drone.quantity.minus(price);
      }
      n++;
    }
    this.drone.reloadLimit();
  }

  //#region Save and load
  getSave(): any {
    const data: any = {};
    data.r = this.unlockedResources.map(r => r.getSave());
    return data;
  }
  load(data: any): boolean {
    if (!("r" in data && isArray(data.r))) return false;
    this.allResources.forEach(r => r.reset());

    for (const res of data.r) {
      const resource = this.allResources.find(u => u.id === res.i);
      if (resource) resource.load(res);
      // console.log("Res: " + resource.name + " " + resource.quantity.toNumber());
    }

    [this.metalX1, this.crystal, this.energyX1].forEach(r => {
      r.quantity = r.quantity.max(1);
    });

    this.reloadList();
    this.limited.forEach(rl => {
      rl.reloadLimit();
    });
    return true;
  }
  //#endregion
}

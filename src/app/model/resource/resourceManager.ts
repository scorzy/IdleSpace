import { Resource } from "./resource";
import { ISalvable } from "../base/ISalvable";
import isArray from "lodash-es/isArray";
import { solveEquation } from "ant-utils";
import { ResourceGroup } from "./resourceGroup";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";
import { BuyAction } from "../actions/buyAction";

export class ResourceManager implements ISalvable {
  private static instance: ResourceManager;

  unlockedResources: Resource[];
  unlockedProdResources: Resource[];
  limitedResources: Resource[];
  allResources: Resource[];
  tierGroups: ResourceGroup[];
  unlockedTierGroups: ResourceGroup[];

  // #region Resources
  metal: Resource;
  crystal: Resource;
  alloy: Resource;
  energy: Resource;
  computing: Resource;
  habitableSpace: Resource;
  miningDistrict: Resource;
  crystalDistrict: Resource;

  battery: Resource;

  metalMine: Resource;
  metalX1: Resource;
  metalX2: Resource;
  metalX3: Resource;

  crystalMine: Resource;
  crystalX1: Resource;
  crystalX2: Resource;
  crystalX3: Resource;

  alloyFoundry: Resource;
  alloyX1: Resource;
  alloyX2: Resource;
  alloyX3: Resource;

  energyPlant: Resource;
  energyX1: Resource;
  energyX2: Resource;
  energyX3: Resource;

  computingX1: Resource;
  computingX2: Resource;
  computingX3: Resource;
  // #endregion
  //#region group
  materials: Resource[];
  districts: Resource[];
  matGroup: ResourceGroup;
  tier1: Resource[];
  tier2: Resource[];
  tier3: Resource[];

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
    this.energy.limit = new Decimal(10);

    this.computing = new Resource("f");
    this.computing.shape = "computing";
    //#endregion

    this.metalMine = new Resource("mm");
    this.crystalMine = new Resource("cm");
    this.alloyFoundry = new Resource("af");
    this.energyPlant = new Resource("ep");

    //      Metal
    this.metalX1 = new Resource("m1");
    this.metalX1.unlocked = true;
    this.metalX1.quantity = new Decimal(1);
    this.metalX2 = new Resource("m2");
    this.metalX3 = new Resource("m3");
    this.metal.addGenerator(this.metalX1);
    this.energy.addGenerator(this.metalX1, -1);
    this.metalX1.addGenerator(this.metalX2);
    this.metalX2.addGenerator(this.metalX3);

    //      Crystal
    this.crystalX1 = new Resource("c1");
    this.crystalX1.unlocked = true;
    this.crystalX1.quantity = new Decimal(1);
    this.crystalX2 = new Resource("c2");
    this.crystalX3 = new Resource("c3");
    this.crystal.addGenerator(this.crystalX1);
    this.energy.addGenerator(this.crystalX1, -1);
    this.crystalX1.addGenerator(this.crystalX2);
    this.crystalX2.addGenerator(this.crystalX3);

    //      Alloy
    this.alloyX1 = new Resource("a1");
    this.alloyX2 = new Resource("a2");
    this.alloyX3 = new Resource("a3");
    this.alloy.addGenerator(this.alloyX1);
    this.energy.addGenerator(this.alloyX1, -1);
    this.alloyX1.addGenerator(this.alloyX2);
    this.alloyX2.addGenerator(this.alloyX3);

    //      Energy
    this.energy.unlocked = true;
    this.energy.quantity = new Decimal(1);
    this.energyX1 = new Resource("e1");
    this.energyX2 = new Resource("e2");
    this.energyX3 = new Resource("e3");
    this.energyX1.unlocked = true;
    this.energyX1.quantity = new Decimal(3);
    this.energy.addGenerator(this.energyX1);
    this.energyX1.addGenerator(this.energyX2);
    this.energyX2.addGenerator(this.energyX3);

    //      Computing
    this.computingX1 = new Resource("f1");
    this.computingX2 = new Resource("f2");
    this.computingX3 = new Resource("f3");
    this.computing.addGenerator(this.computingX1);
    this.energy.addGenerator(this.computingX1, -2);
    this.computingX1.addGenerator(this.computingX2);
    this.computingX2.addGenerator(this.computingX3);

    //      Space
    this.habitableSpace = new Resource("hs");
    this.miningDistrict = new Resource("md");
    this.crystalDistrict = new Resource("cd");
    this.districts = [
      this.miningDistrict,
      this.crystalDistrict,
      this.habitableSpace
    ];
    this.districts.forEach(d => {
      d.unlocked = true;
      d.quantity = new Decimal(10);
    });

    //#region Group
    this.materials = [
      this.metal,
      this.crystal,
      this.alloy,
      this.energy,
      this.computing
    ];
    this.tier1 = [
      this.metalX1,
      this.crystalX1,
      this.alloyX1,
      this.energyX1,
      this.computingX1
    ];
    this.tier2 = [
      this.metalX2,
      this.crystalX2,
      this.alloyX2,
      this.energyX2,
      this.computingX2
    ];
    this.tier3 = [
      this.metalX3,
      this.crystalX3,
      this.alloyX3,
      this.energyX3,
      this.computingX3
    ];
    //#endregion

    this.limited = [this.metalX1, this.crystalX1, this.alloyX1, this.energyX1];
    this.metalX1.limitStorage = this.metalMine;
    this.crystalX1.limitStorage = this.crystalMine;
    this.alloyX1.limitStorage = this.alloyFoundry;
    this.energyX1.limitStorage = this.energyPlant;

    this.metalMine.quantity = new Decimal(1);
    this.crystalMine.quantity = new Decimal(1);
    this.alloyFoundry.quantity = new Decimal(1);
    this.energyPlant.quantity = new Decimal(1);

    this.limited.forEach(rl => {
      rl.isLimited = true;
      rl.reloadLimit();
    });

    //#region Actions
    //#region Buy
    this.metalX1.generateBuyAction(
      new MultiPrice([new Price(this.metal, 100), new Price(this.crystal, 25)])
    );
    this.crystalX1.generateBuyAction(
      new MultiPrice([new Price(this.metal, 100), new Price(this.crystal, 50)])
    );
    this.metalX1.buyAction.afterBuy = this.unlockComputing.bind(this);
    this.crystalX1.buyAction.afterBuy = this.unlockComputing.bind(this);

    this.alloyX1.generateBuyAction(
      new MultiPrice([new Price(this.metal, 100), new Price(this.crystal, 100)])
    );
    this.energyX1.generateBuyAction(
      new MultiPrice([new Price(this.metal, 100), new Price(this.crystal, 100)])
    );
    this.computingX1.generateBuyAction(
      new MultiPrice([new Price(this.metal, 100), new Price(this.crystal, 200)])
    );
    //#endregion
    //#region Mine

    //  Metal Mine
    this.metalMine.unlocked = true;
    const buyMetalMine = new BuyAction(
      this.metalMine,
      new MultiPrice([
        new Price(this.metal, 1000),
        new Price(this.crystal, 250),
        new Price(this.miningDistrict, 1, 1)
      ])
    );
    buyMetalMine.afterBuy = () => {
      this.metalX1.reloadLimit();
    };
    buyMetalMine.name = "Buy " + this.metalMine.name;
    this.metalX1.actions.push(buyMetalMine);

    //  Crystal Mine
    this.crystalMine.unlocked = true;
    const buyCrystalMine = new BuyAction(
      this.crystalMine,
      new MultiPrice([
        new Price(this.metal, 1000),
        new Price(this.crystal, 500),
        new Price(this.crystalDistrict, 1, 1)
      ])
    );
    buyCrystalMine.afterBuy = () => {
      this.crystalX1.reloadLimit();
    };
    buyCrystalMine.name = "Buy " + this.crystalMine.name;
    this.crystalX1.actions.push(buyCrystalMine);

    //  Energy Plant
    this.energyPlant.unlocked = true;
    const buyEnergyPlant = new BuyAction(
      this.energyPlant,
      new MultiPrice([
        new Price(this.metal, 1500),
        new Price(this.crystal, 1000),
        new Price(this.habitableSpace, 1, 1)
      ])
    );
    buyEnergyPlant.afterBuy = () => {
      this.energyX1.reloadLimit();
    };
    buyEnergyPlant.name = "Buy " + this.energyPlant.name;
    this.energyX1.actions.push(buyEnergyPlant);

    //  Alloy Foundry
    const buyFoundry = new BuyAction(
      this.alloyFoundry,
      new MultiPrice([
        new Price(this.metal, 1000),
        new Price(this.crystal, 1000),
        new Price(this.habitableSpace, 1, 1)
      ])
    );
    buyFoundry.afterBuy = () => {
      this.crystalX1.reloadLimit();
    };
    buyFoundry.name = "Buy " + this.alloyFoundry.name;
    this.alloyX1.actions.push(buyFoundry);
    //#endregion
    //#endregion

    this.allResources = [
      this.metal,
      this.crystal,
      this.alloy,
      this.energy,
      this.computing,
      this.metalX1,
      this.metalX2,
      this.metalX3,
      this.crystalX1,
      this.crystalX2,
      this.crystalX3,
      this.energyX1,
      this.energyX2,
      this.energyX3,
      this.alloyX1,
      this.alloyX2,
      this.alloyX3,
      this.computingX1,
      this.computingX2,
      this.computingX3,
      this.habitableSpace,
      this.miningDistrict,
      this.crystalDistrict
    ];
    // this.allResources.forEach(r => {
    //   r.unlocked = true;
    // });
    this.matGroup = new ResourceGroup("0", "Materials", "", this.materials);
    this.tierGroups = [
      this.matGroup,
      new ResourceGroup("1", "Tier 1", "", this.tier1),
      new ResourceGroup("2", "Tier 2", "", this.tier2),
      new ResourceGroup("3", "Tier 3", "", this.tier3),
      new ResourceGroup("4", "Districts", "", this.districts)
    ];

    this.reloadList();
  }

  static getInstance() {
    return ResourceManager.instance;
  }
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
  }
  loadPolynomial(): void {
    this.unlockedProdResources.forEach(res => {
      res.reloadProd();
    });
    this.energy.isCapped = false;

    for (const unit of this.unlockedProdResources) {
      unit.a = new Decimal(0);
      unit.b = new Decimal(0);
      unit.c = new Decimal(0);

      if (!unit.isCapped) {
        for (const prod1 of unit.generators.filter(p =>
          p.producer.isActive()
        )) {
          // x
          const prodX = prod1.prodPerSec;
          unit.c = unit.c.plus(prodX.times(prod1.producer.quantity));

          if (!prod1.producer.isCapped) {
            for (const prod2 of prod1.producer.generators.filter(p =>
              p.producer.isActive()
            )) {
              // x^2
              const prodX2 = prod2.prodPerSec.times(prodX);
              unit.b = unit.b.plus(prodX2.times(prod2.producer.quantity));

              if (!prod2.producer.isCapped) {
                for (const prod3 of prod2.producer.generators.filter(p =>
                  p.producer.isActive()
                )) {
                  // x^3
                  const prodX3 = prod3.prodPerSec.times(prodX2);
                  unit.a = unit.a.plus(prodX3.times(prod3.producer.quantity));
                }
              }
            }
          }
        }
      }
      unit.a = unit.a.div(6);
      unit.b = unit.b.div(2);
    }

    if (this.energy.quantity.gte(this.energy.limit)) {
      this.energy.isCapped = true;
    }
  }
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
      if (unit.a.lt(0) || unit.b.lt(0) || unit.c.lt(0) || d.lte(0)) {
        const solution = solveEquation(unit.a, unit.b, unit.c, d).filter(s =>
          s.gte(0)
        );

        if (solution.length > 0) {
          const min = solution.reduce(
            (p, c) => p.min(c),
            new Decimal(Number.POSITIVE_INFINITY)
          );
          if (this.maxTime > min.toNumber() * 1000) {
            this.maxTime = min.toNumber() * 1000;
            this.unitZero = unit;
          }
          unit.endIn = Math.min(min.times(1000).toNumber(), unit.endIn);
          unit.isEnding = true;
        }
      }
    });

    //  Load full times
    this.limitedResources
      .filter(r => !r.isCapped && !r.isEnding)
      .forEach(unit => {
        const d = unit.quantity.minus(unit.limit);
        if (unit.a.gt(0) || unit.b.gt(0) || unit.c.gt(0)) {
          const solution = solveEquation(unit.a, unit.b, unit.c, d).filter(s =>
            s.gte(0)
          );

          if (solution.length > 0) {
            const min = solution.reduce(
              (p, c) => p.min(c),
              new Decimal(Number.POSITIVE_INFINITY)
            );
            if (this.maxTime > min.toNumber() * 1000) {
              this.maxTime = min.toNumber() * 1000;
              this.unitZero = unit;
            }
            unit.fullIn = Math.min(min.times(1000).toNumber(), unit.fullIn);
          }
        }
      });
    return this.maxTime;
  }
  /**
   * Update resources
   *
   * @param  seconds in seconds
   */
  update(seconds: number): void {
    this.unlockedResources
      .filter(u => !u.a.eq(0) || !u.b.eq(0) || !u.c.eq(0))
      .forEach(u => {
        u.quantity = u.quantity
          .plus(u.a.times(Decimal.pow(seconds, 3)))
          .plus(u.b.times(Decimal.pow(seconds, 2)))
          .plus(u.c.times(seconds));
      });
    this.unlockedResources
      .filter(u => u.quantity.lt(0))
      .forEach(u => {
        u.quantity = new Decimal(0);
      });
    this.energy.quantity = this.energy.quantity.min(this.energy.limit);
  }
  stopResource() {
    if (this.unitZero && this.unitZero.isEnding) {
      //  Stop consumers
      this.unitZero.generators
        .filter(p => p.ratio.lt(0))
        .forEach(p => {
          p.producer.operativity = 0;
        });
      //  Stop consumers of producers
      this.unitZero.generators
        .filter(p => p.ratio.gt(0))
        .forEach(p => {
          p.producer.generators
            .filter(p2 => p2.ratio.lt(0))
            .forEach(p2 => {
              p2.producer.operativity = 0;
            });
        });
      this.unitZero.isEnding = false;
    }
    if (this.unitZero && !this.unitZero.isEnding) {
      this.unitZero.isCapped = true;
    }
  }
  reloadActions() {
    this.unlockedResources.forEach(res => {
      res.actions.forEach(act => act.reload());
    });
  }

  unlockComputing() {
    if (
      !this.computing.unlocked &&
      this.metalX1.quantity.gte(5) &&
      this.crystalX1.quantity.gte(5)
    ) {
      this.computing.unlock();
      this.computingX1.unlock();
    }
  }

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
    }

    this.limited.forEach(rl => {
      rl.reloadLimit();
    });
    return true;
  }
}

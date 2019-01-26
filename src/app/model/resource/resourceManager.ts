import { Resource } from "./resource";
import { ISalvable } from "../base/ISalvable";
import isArray from "lodash-es/isArray";
import { solveEquation } from "ant-utils";
import { ResourceGroup } from "./resourceGroup";

export class ResourceManager implements ISalvable {
  unlockedResources: Resource[];
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

  metalX1: Resource;
  metalX2: Resource;
  metalX3: Resource;

  crystalX1: Resource;
  crystalX2: Resource;
  crystalX3: Resource;

  alloyX1: Resource;
  alloyX2: Resource;
  alloyX3: Resource;
  // #endregion

  //#region group
  materials: Resource[];
  matGroup: ResourceGroup;
  tier1: Resource[];
  tier2: Resource[];
  tier3: Resource[];
  //#endregion

  unitZero: Resource;
  maxTime: number = Number.POSITIVE_INFINITY;

  constructor() {
    this.metal = new Resource("m");
    this.metal.unlocked = true;
    this.crystal = new Resource("c");
    this.alloy = new Resource("a");
    this.energy = new Resource("e");
    this.computing = new Resource("f");

    this.metalX1 = new Resource("m1");
    this.metal.addGenerator(this.metalX1, 0.01);
    this.metalX1.unlocked = true;

    this.metalX1.quantity = new Decimal(1);

    this.metalX2 = new Resource("m2");
    this.metalX3 = new Resource("m3");

    this.crystalX1 = new Resource("c1");
    this.crystal.addGenerator(this.crystalX1, 0.01);
    this.crystalX1.unlocked = true;
    this.crystalX1.quantity = new Decimal(1);

    this.crystalX2 = new Resource("c2");
    this.crystalX3 = new Resource("c3");

    this.alloyX1 = new Resource("a1");
    this.alloyX2 = new Resource("a2");
    this.alloyX3 = new Resource("a3");

    this.materials = [
      this.metal,
      this.crystal,
      this.alloy,
      this.energy,
      this.computing
    ];
    this.tier1 = [this.metalX1, this.crystalX1, this.alloyX1];
    this.tier2 = [this.metalX2, this.crystalX2, this.alloyX2];
    this.tier3 = [this.metalX3, this.crystalX3, this.alloyX3];

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
      this.alloyX1,
      this.alloyX2,
      this.alloyX3
    ];
    this.allResources.forEach(r => {
      r.unlocked = true;
    });
    this.matGroup = new ResourceGroup("0", "Materials", "", this.materials);
    this.tierGroups = [
      this.matGroup,
      new ResourceGroup("1", "Tier 1", "", this.tier1),
      new ResourceGroup("2", "Tier 2", "", this.tier2),
      new ResourceGroup("3", "Tier 3", "", this.tier3)
    ];

    this.reloadList();
  }
  reloadList(): void {
    this.unlockedResources = this.allResources.filter(r => r.unlocked);
    this.tierGroups.forEach(tg => tg.reload());
    this.unlockedTierGroups = this.tierGroups.filter(
      u => u.unlockedResources.filter.length > 0
    );
  }
  loadPolynomial(): void {
    this.unlockedResources.forEach(res => {
      res.reloadProd();
    });

    for (const unit of this.unlockedResources) {
      unit.a = new Decimal(0);
      unit.b = new Decimal(0);
      unit.c = new Decimal(0);
      const d = unit.quantity;

      for (const prod1 of unit.generators.filter(p => p.producer.isActive())) {
        // x
        const prodX = prod1.prodPerSec;
        unit.c = unit.c.plus(prodX.times(prod1.producer.quantity));

        for (const prod2 of prod1.producer.generators.filter(p =>
          p.producer.isActive()
        )) {
          // x^2
          const prodX2 = prod2.prodPerSec.times(prodX);
          unit.b = unit.b.plus(prodX2.times(prod2.producer.quantity));

          for (const prod3 of prod2.producer.generators.filter(p =>
            p.producer.isActive()
          )) {
            // x^3
            const prodX3 = prod3.prodPerSec.times(prodX2);
            unit.a = unit.a.plus(prodX3.times(prod3.producer.quantity));
          }
        }
      }
      unit.a = unit.a.div(6);
      unit.b = unit.b.div(2);
    }
  }
  loadEndTime(): number {
    this.maxTime = Number.POSITIVE_INFINITY;
    this.unitZero = null;

    this.unlockedResources.forEach(unit => {
      unit.endIn = Number.POSITIVE_INFINITY;
      unit.isEnding = false;
    });

    this.unlockedResources.forEach(unit => {
      const d = unit.quantity;
      if (unit.a.lt(0) || unit.b.lt(0) || unit.c.lt(0) || d.lt(0)) {
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
    this.unlockedResources.forEach(u => {
      u.quantity = u.quantity.max(0);
    });
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

    return true;
  }
}

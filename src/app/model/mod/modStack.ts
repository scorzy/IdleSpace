import { Mod } from "./mod";
import { ISalvable } from "../base/ISalvable";
import { Resource } from "../resource/resource";
import { ResourceManager } from "../resource/resourceManager";
import { ResearchManager } from "../research/researchManager";
import { Bonus } from "../bonus/bonus";
import { BonusStack } from "../bonus/bonusStack";
import { AllSkillEffects } from "../prestige/allSkillEffects";

export const MOD_EFFICIENCY = 0.1;
export const MOD_PRODUCTION = 0.2;
export const MOD_ENERGY = -0.05;
export const MOD_MORE = 1;

export class ModStack implements ISalvable {
  mods: Mod[];
  efficiency: Mod;
  production: Mod;
  energyMod: Mod;
  priceMod: Mod;
  moreDrones: Mod;
  resource: Resource;
  totalBonus = new BonusStack();
  maxPoints = new Decimal();
  usedPoint = new Decimal();
  unusedPoints = new Decimal();

  generateMods(resource: Resource) {
    this.resource = resource;

    this.efficiency = new Mod("f");
    this.mods = [this.efficiency];
    resource.productionMultiplier.additiveBonus.push(
      new Bonus(this.efficiency, MOD_EFFICIENCY, true)
    );

    if (resource !== ResourceManager.getInstance().energyX1) {
      this.production = new Mod("p");
      this.mods.push(this.production);
      resource.productionMultiplier.additiveBonus.push(
        new Bonus(this.production, MOD_PRODUCTION)
      );
    }
    this.priceMod = new Mod("s");
    this.mods.push(this.priceMod);

    //  Energy
    if (resource !== ResourceManager.getInstance().energyX1) {
      this.energyMod = new Mod("e");
      this.mods.push(this.energyMod);
      const energyProd = resource.products.find(
        p => p.product === ResourceManager.getInstance().energy
      );
      if (!energyProd.productionMultiplier) {
        energyProd.productionMultiplier = new BonusStack();
      }
      energyProd.productionMultiplier.multiplicativeBonus.push(
        new Bonus(this.energyMod, MOD_ENERGY)
      );
    }
    this.moreDrones = new Mod("m");
    this.mods.push(this.moreDrones);

    this.mods.forEach(m => {
      m.resId = resource.id;
    });
  }
  getTotalUsed(): number {
    return this.mods
      .map(m => m.quantity_ui)
      .reduce((p: number, c: number) => p + c);
  }
  validate(): boolean {
    const total = this.getTotalUsed();
    const max = this.getMax().toNumber();
    return (
      total <= max &&
      this.mods.findIndex(m => m.quantity_ui > m.max) === -1 &&
      this.mods.findIndex(m => m.quantity_ui < m.min) === -1 &&
      this.mods.findIndex(m => m.quantity_ui < Math.ceil(max / -2)) === -1 &&
      this.mods.findIndex(m => isNaN(m.quantity_ui)) === -1
    );
  }
  save() {
    if (this.validate()) {
      this.mods.forEach(m => {
        m.quantity = new Decimal(m.quantity_ui);
      });
      this.setPrice();
      this.resource.reloadLimit();
      this.loadUsedPoint();
    }
  }
  loadUsedPoint() {
    this.usedPoint = this.mods
      .map(m => m.quantity)
      .reduce((p: Decimal, c: Decimal) => p.plus(c));
  }
  private getMax(): Decimal {
    return ResearchManager.getInstance()
      .modding.quantity.times(this.totalBonus.getTotalBonus())
      .plus(
        this.resource.modPrestige ? this.resource.modPrestige.numOwned * 10 : 0
      )
      .plus(AllSkillEffects.MODDING_PLUS.numOwned * 5)
      .times(AllSkillEffects.DOUBLE_MODDING.numOwned + 1);
  }
  setPrice() {
    this.resource.standardPrice = new Decimal(1).plus(
      this.priceMod.quantity.times(-0.1)
    );
  }
  reload() {
    const newMax = this.getMax();
    if (!newMax.eq(this.maxPoints)) this.maxPoints = newMax;

    const un = this.maxPoints.minus(this.usedPoint);
    if (!this.unusedPoints.eq(un)) this.unusedPoints = un;
  }

  //#region Save and Load
  getSave() {
    const save: any = {};
    save.m = this.mods.filter(m => !m.quantity.eq(0)).map(m => m.getSave());
    return save;
  }
  load(data: any): boolean {
    if (!("m" in data)) return false;
    for (const modData of data.m) {
      const mod = this.mods.find(m => m.id === modData.i);
      if (mod) {
        mod.load(modData);
      }
    }
    this.setPrice();
    this.loadUsedPoint();
    return true;
  }
  //#endregion
}

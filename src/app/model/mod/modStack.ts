import { Mod } from "./mod";
import { ISalvable } from "../base/ISalvable";
import { Resource } from "../resource/resource";
import { ResourceManager } from "../resource/resourceManager";
import { ResearchManager } from "../research/researchManager";
import { Bonus } from "../bonus/bonus";
import { BonusStack } from "../bonus/bonusStack";

export class ModStack implements ISalvable {
  mods: Mod[];
  efficiency: Mod;
  production: Mod;
  energyMod: Mod;
  resource: Resource;

  generateMods(resource: Resource) {
    this.resource = resource;

    this.efficiency = new Mod("f");
    this.production = new Mod("p");
    this.mods = [this.efficiency, this.production];
    resource.efficiencyMultiplier.additiveBonus.push(
      new Bonus(this.efficiency, 0.1)
    );
    resource.productionMultiplier.additiveBonus.push(
      new Bonus(this.production, 0.3)
    );

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
        new Bonus(this.energyMod, -0.05)
      );
    }
  }
  getTotal(): number {
    return this.mods
      .map(m => m.quantity_ui)
      .reduce((p: number, c: number) => p + c);
  }
  validate(): boolean {
    const total = this.getTotal();
    const max = ResearchManager.getInstance().modding.quantity.toNumber();
    return total <= max;
  }
  save() {
    if (this.validate()) {
      this.mods.forEach(m => {
        m.quantity = new Decimal(m.quantity_ui);
      });
    }
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
    return true;
  }
  //#endregion
}

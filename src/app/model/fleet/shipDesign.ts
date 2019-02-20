import { ShipType } from "./shipTypes";
import { Module } from "./module";
import { ISalvable } from "../base/ISalvable";
import { Weapon } from "./weapon";
import { Utility } from "./utility";

export class ShipDesign implements ISalvable {
  id: string;
  type: ShipType;
  name = "";
  shipQuantity = new Decimal(0);

  weapons = new Array<[Decimal, Weapon]>();
  utility = new Array<[Decimal, Utility]>();

  totalDamage: Decimal;
  totalArmor: Decimal;
  totalShield: Decimal;
  totalHull: Decimal;
  totalEnergy: Decimal;

  reload() {
    this.totalDamage = new Decimal(0);
    this.totalArmor = new Decimal(0);
    this.totalShield = new Decimal(0);
    this.totalHull = new Decimal(this.type.health);
    this.totalEnergy = new Decimal(0);

    this.weapons.forEach(w => {
      this.totalDamage = this.totalDamage.plus(w[0].times(w[1].damage));
      this.totalEnergy = this.totalEnergy.plus(w[0].times(w[1].energyBalance));
    });
    this.utility.forEach(w => {
      this.totalEnergy = this.totalEnergy.plus(w[0].times(w[1].energyBalance));
      this.totalArmor = this.totalArmor.plus(w[0].times(w[1].armor));
      this.totalShield = this.totalShield.plus(w[0].times(w[1].shield));
    });
  }
  getSave(): any {
    const data: any = {};
    data.i = this.id;
    if (!this.shipQuantity.eq(0)) data.q = this.shipQuantity;

    return data;
  }
  load(data: any): boolean {
    if (!("i" in data && data.i === this.id)) return false;
    if ("q" in data) this.shipQuantity = Decimal.fromDecimal(data.q);

    return true;
  }
}

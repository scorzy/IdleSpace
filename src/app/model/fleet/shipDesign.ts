import { ShipType } from "./shipTypes";
import { ISalvable } from "../base/ISalvable";
import { DesignLine } from "./designLine";

export class ShipDesign implements ISalvable {
  id: string;
  type: ShipType;
  name = "";
  shipQuantity = new Decimal(0);

  weapons = new Array<DesignLine>();
  utility = new Array<DesignLine>();

  totalDamage: Decimal;
  totalArmor: Decimal;
  totalShield: Decimal;
  totalHull: Decimal;
  totalEnergy: Decimal;

  editable: ShipDesign;

  reload() {
    this.totalDamage = new Decimal(0);
    this.totalArmor = new Decimal(0);
    this.totalShield = new Decimal(0);
    this.totalHull = new Decimal(this.type ? this.type.health : 0);
    this.totalEnergy = new Decimal(0);

    this.weapons
      .filter(q => q.isValid())
      .forEach(w => {
        this.totalDamage = this.totalDamage.plus(
          w.quantity.times(w.module.damage)
        );

        this.totalEnergy = this.totalEnergy.plus(
          w.quantity.times(w.module.energyBalance)
        );
      });
    this.utility
      .filter(q => q.isValid())
      .forEach(w => {
        this.totalEnergy = this.totalEnergy.plus(
          w.quantity.times(w.module.energyBalance)
        );
        this.totalArmor = this.totalArmor.plus(w.quantity.times(w.module.armor));
        this.totalShield = this.totalShield.plus(
          w.quantity.times(w.module.shield)
        );
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
  copy() {
    this.editable = new ShipDesign();
    this.editable.name = this.name;
    this.editable.id = this.id;
    this.editable.type = this.type;
    this.editable.shipQuantity = new Decimal(this.shipQuantity);
    this.weapons.forEach(w => {
      this.editable.weapons.push(DesignLine.copy(w));
    });
    this.utility.forEach(w => {
      this.editable.utility.push(DesignLine.copy(w));
    });

    this.editable.reload();
  }
  addWeapon() {
    this.editable.weapons.push(new DesignLine());
    this.editable.reload();
  }
  removeWeapon(i: number) {
    this.editable.weapons.splice(i, 1);
    this.editable.reload();
  }
}

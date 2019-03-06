import { ShipType, ShipTypes } from "./shipTypes";
import { ISalvable } from "../base/ISalvable";
import { DesignLine } from "./designLine";

export class ShipDesign implements ISalvable {
  id: string;
  type: ShipType;
  name = "";
  shipQuantity = new Decimal(0);

  modules = new Array<DesignLine>();

  totalDamage: Decimal;
  totalArmor: Decimal;
  totalShield: Decimal;
  totalEnergy: Decimal;

  editable: ShipDesign;
  usedModulePoint = 0;
  isValid = true;

  reload() {
    this.totalDamage = new Decimal(0);
    this.totalShield = new Decimal(0);
    this.totalEnergy = new Decimal(0);
    this.totalArmor = new Decimal(this.type ? this.type.health : 0);
    this.usedModulePoint = 0;

    this.modules
      .filter(q => q.isValid())
      .forEach(w => {
        this.totalDamage = this.totalDamage.plus(
          w.module.damage.times(w.size).times(w.quantity)
        );
        this.totalEnergy = this.totalEnergy.plus(
          w.module.energyBalance.times(w.size).times(w.quantity)
        );
        this.totalArmor = this.totalArmor.plus(
          w.module.armor.times(w.size).times(w.quantity)
        );
        this.totalShield = this.totalShield.plus(
          w.module.shield.times(w.size).times(w.quantity)
        );
        this.usedModulePoint += w.quantity * w.size;
      });

    this.isValid =
      this.totalEnergy.gte(0) &&
      this.usedModulePoint <= this.type.modulePoint &&
      this.modules.length <= this.type.moduleCount;
  }
  getSave(): any {
    const data: any = {};
    data.i = this.id;
    if (!this.shipQuantity.eq(0)) data.q = this.shipQuantity;
    data.t = this.type.id;
    data.n = this.name;
    data.m = this.modules.map(m => m.getSave());

    return data;
  }
  load(data: any): boolean {
    this.id = data.i;
    if ("q" in data) this.shipQuantity = Decimal.fromDecimal(data.q);
    this.type = ShipTypes.find(t => t.id === data.t);
    this.name = data.n;
    if ("m" in data) {
      for (const modData of data.m) {
        this.modules.push(DesignLine.CreateFromData(modData));
      }
    }

    this.reload();
    return true;
  }
  copy() {
    this.editable = new ShipDesign();
    this.editable.name = this.name;
    this.editable.id = this.id;
    this.editable.type = this.type;
    this.editable.shipQuantity = new Decimal(this.shipQuantity);
    this.modules.forEach(w => {
      this.editable.modules.push(DesignLine.copy(w));
    });

    this.editable.reload();
  }
  addModule() {
    this.editable.modules.push(new DesignLine());
    this.editable.reload();
  }
  removeModule(i: number) {
    this.editable.modules.splice(i, 1);
    this.editable.reload();
  }

  saveConfig() {
    if (this.editable && this.editable.isValid) {
      this.modules = this.editable.modules;
      this.reload();
    }
  }
}

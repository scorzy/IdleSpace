import { ISalvable } from "../base/ISalvable";
import { ModData } from "./modData";
import { IResource } from "../base/iResource";

export class Mod implements ISalvable, IResource {
  quantity = new Decimal();
  quantity_ui = 0;
  name = "";
  description = "";
  resId = "";
  max: number = Number.POSITIVE_INFINITY;
  min: number = Number.NEGATIVE_INFINITY;

  constructor(public id: string) {
    const modData = ModData[id];
    if (modData) {
      this.name = modData.name;
      this.description = modData.description;
      this.getBonus = modData.getBonus;
      if ("min" in modData) this.min = modData.min;
      if ("max" in modData) this.max = modData.max;
    }
  }

  getSave(): any {
    const save: any = {};
    save.i = this.id;
    save.q = this.quantity;
    return save;
  }
  load(data: any): boolean {
    if (!("i" in data && data.i === this.id)) return false;
    if ("q" in data) this.quantity = Decimal.fromDecimal(data.q);
    this.quantity = this.quantity.min(this.max);
    this.quantity = this.quantity.max(this.min);
    return true;
  }
  getBonus(num: DecimalSource): string {
    return new Decimal(num).toNumber() + "";
  }
  getQuantity(): Decimal {
    return this.quantity;
  }
}

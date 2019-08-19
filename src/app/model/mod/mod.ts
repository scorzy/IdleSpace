import { ISalvable } from "../base/ISalvable";
import { ModData } from "./modData";
import { IResource } from "../base/iResource";
import { MainService } from "src/app/main.service";
import { MyFromDecimal } from "../utility/myUtility";

export class Mod implements ISalvable, IResource {
  quantity = new Decimal();
  quantity_ui = 0;
  name = "";
  description = "";
  resId = "";
  max = 1e300;
  min = -1e300;
  tooltip = "";

  constructor(public id: string) {
    const modData = ModData[id];
    if (modData) {
      this.name = modData.name;
      this.description = modData.description;
      this.getBonus = modData.getBonus;
      this.tooltip = modData.tooltip;
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
    if ("q" in data) this.quantity = MyFromDecimal(data.q);
    this.quantity = this.quantity.min(this.max);
    this.quantity = this.quantity.max(this.min);
    return true;
  }
  getBonus(num: DecimalSource): string {
    return MainService.formatPipe.transform(num);
  }
  getQuantity(): Decimal {
    return this.quantity;
  }
}

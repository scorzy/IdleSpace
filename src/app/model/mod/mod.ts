import { ISalvable } from "../base/ISalvable";
import { ModData } from "./modData";
import { IResource } from "../base/iResource";

export class Mod implements ISalvable, IResource {
  constructor(public id: string) {
    const modData = ModData[id];
    if (modData) {
      this.name = modData.name;
      this.description = modData.description;
    }
  }

  quantity = new Decimal();
  quantity_ui = 0;
  name = "";
  description = "";

  getSave(): any {
    const save: any = {};
    save.i = this.id;
    save.q = this.quantity;
    return save;
  }
  load(data: any): boolean {
    if (!("i" in data && data.i === this.id)) return false;
    if ("q" in data) this.quantity = Decimal.fromDecimal(data.q);
    return true;
  }
}

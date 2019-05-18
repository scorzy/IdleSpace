import { IResource } from "../base/iResource";
import { ISalvable } from "../base/ISalvable";
import { SkillGroup } from "./skillGroup";
import { SkillGroups } from "./allSkillEffects";
import { Action } from "../actions/abstractAction";
import { BuyAction } from "../actions/buyAction";

export class SkillEffect implements IResource, ISalvable {
  id: string;
  notable = false;

  shape: string;
  numOwned = 0;
  numBuy = 0;
  label = "";

  name: string;
  description: string;

  shapeNotAvailable: string;
  shapeOwned: string;
  shapeAvailable: string;
  max = Number.MAX_SAFE_INTEGER;
  skillGroup: SkillGroup;
  buyAction: Action;

  constructor(idNum: number, skillGroupId: string) {
    this.id = "" + idNum;
    this.skillGroup = SkillGroups.find(g => g.id === skillGroupId);
  }

  getDescription(num = 1): string {
    return "";
  }
  getQuantity(): Decimal {
    return new Decimal(this.numOwned);
  }
  afterBuy() {}

  getSave() {
    const save: any = {};
    save.i = this.id;
    save.q = this.numBuy;
    return save;
  }
  load(data: any): boolean {
    if (!("i" in data || data.i !== this.id)) return false;
    if ("q" in data) this.numBuy = data.q;
    return true;
  }
}

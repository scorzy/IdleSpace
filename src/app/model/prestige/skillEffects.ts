import { IResource } from "../base/iResource";

export class SkillEffect implements IResource {
  private static lastId = 0;
  id: string;
  notable = false;

  shape: string;
  numOwned = 0;
  label = "";

  name: string;
  description: string;

  shapeNotAvailable: string;
  shapeOwned: string;
  shapeAvailable: string;

  constructor() {
    this.id = "" + SkillEffect.lastId;
    SkillEffect.lastId++;
  }

  getDescription(num = 1): string {
    return "";
  }
  getQuantity(): Decimal {
    return new Decimal(this.numOwned);
  }
  afterBuy() {}
}

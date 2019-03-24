import { IResource } from "../base/iResource";

export class Bonus {
  public quantity = new Decimal(1);
  constructor(public base: IResource, _quantity: DecimalSource = 1) {
    this.quantity = new Decimal(_quantity);
  }
}

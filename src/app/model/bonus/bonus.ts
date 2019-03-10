import { ISpendable } from "../base/ISpendable";
import { IHasQuantity } from "../base/IHasQuantity";

export class Bonus {
  constructor(public base: IHasQuantity, public quantity: Decimal) {}
}

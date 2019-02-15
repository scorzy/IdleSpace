import { ISpendable } from "../base/ISpendable";

export class Bonus {
  constructor(public base: ISpendable, public quantity: Decimal) {}
}

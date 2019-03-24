import { IResource } from "../base/iResource";

export class Bonus {
  constructor(public base: IResource, public quantity: Decimal) {}
}

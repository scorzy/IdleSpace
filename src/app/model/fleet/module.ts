import { AbstractUnlockable } from "../base/AbstractUnlockable";

export class Module extends AbstractUnlockable {
  size: number;
  energyBalance = new Decimal(0);
  alloyPrice = new Decimal(0);

  constructor(id: string) {
    super();
    this.id = id;
  }
}

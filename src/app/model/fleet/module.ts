import { AbstractUnlockable } from "../base/AbstractUnlockable";

export class Module extends AbstractUnlockable {
  size: number;
  energyBalance = new Decimal(0);
  alloyPrice = new Decimal(0);

  damage: Decimal;
  hullPercent = 100;
  armorPercent = 100;
  shieldPercent = 100;
  shield = new Decimal(0);
  armor = new Decimal(0);

  constructor(id: string) {
    super();
    this.id = id;
  }
}

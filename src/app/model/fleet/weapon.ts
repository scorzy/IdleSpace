import { Module } from "./module";

export class Weapon extends Module {
  damage: Decimal;
  hullPercent = 100;
  armorPercent = 100;
  shieldPercent = 100;

  constructor(id: string) {
    super(id);
  }
}

import { Module } from "./module";
import { descriptions } from "../descriptions";

export class Weapon extends Module {
  damage: Decimal;
  hullPercent = 100;
  armorPercent = 100;
  shieldPercent = 100;

  constructor(id: string) {
    super(id);
    this.name = descriptions.weapons[id][0];
  }
}

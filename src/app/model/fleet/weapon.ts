export class Weapon {
  name = "";
  size: number;
  power: Decimal;
  hullDamagePercent: number;
  shieldDamagePercent: number;

  constructor(public id: string) {}
}

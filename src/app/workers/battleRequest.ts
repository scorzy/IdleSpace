export interface IWeapon {
  computedDamage: Decimal;
  shieldPercent: number;
  armorPercent: number;
}
export class ShipData {
  id: string;
  quantity: Decimal;
  totalArmor: Decimal;
  totalShield: Decimal;
  modules: IWeapon[];
}

// tslint:disable-next-line: max-classes-per-file
export class BattleRequest {
  playerFleet = new Array<ShipData>();
  enemyFleet = new Array<ShipData>();
}

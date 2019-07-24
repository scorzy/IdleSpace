export interface IWeapon {
  computedDamage: Decimal;
  shieldPercent: number;
  armorPercent: number;
}
export class ShipData {
  id: string;
  class = "";
  quantity: Decimal;
  totalArmor: Decimal;
  totalShield: Decimal;
  armorReduction: Decimal;
  shieldReduction: Decimal;
  shieldCharger: Decimal;
  modules: IWeapon[];
  explosionLevel = 30;
  isDefense = false;
}

// tslint:disable-next-line: max-classes-per-file
export class BattleRequest {
  minTime = 1;
  playerFleet = new Array<ShipData>();
  enemyFleet = new Array<ShipData>();
}

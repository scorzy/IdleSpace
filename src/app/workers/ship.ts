class Ship {
  private static Ships = new Array<Ship>();
  id: string;
  armor: Decimal = new Decimal();
  originalArmor: Decimal;
  explosionLevel: number;
  shield: Decimal = new Decimal();
  originalShield: Decimal;
  modules = new Array<{
    damage: Decimal
    shieldPercent: number
    armorPercent: number
  }>();

  getCopy(): Ship {
    const ret = Ship.Ships.pop() || new Ship();
    ret.id = this.id;
    ret.armor.fromDecimal(this.armor);
    ret.shield.fromDecimal(this.shield);
    // Original value shouldn't get modified, reuse original object instead of creating 10000+ new ones for max ships.
    ret.originalArmor = this.originalArmor;
    ret.originalShield = this.originalShield;
    ret.modules = this.modules;
    ret.explosionLevel = this.explosionLevel;

    return ret;
  }

  free(): void {
    // Reuse object to prevent gc
    Ship.Ships.push(this);
  }
}

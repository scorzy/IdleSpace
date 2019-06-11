class Ship {
  private static Ships = new Array<Ship>();
  private static Decimals = new Array<Decimal>();
  id: string;
  armor: Decimal;
  originalArmor: Decimal;
  explosionLevel: number;
  shield: Decimal;
  originalShield: Decimal;
  modules = new Array<{
    damage: Decimal
    shieldPercent: number
    armorPercent: number
  }>();

  getCopy(): Ship {
    const ret = Ship.Ships.pop() || new Ship();
    ret.id = this.id;
    ret.armor = (Ship.Decimals.pop() || new Decimal()).fromDecimal(this.armor);
    ret.shield = (Ship.Decimals.pop() || new Decimal()).fromDecimal(this.shield);
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
    Ship.Decimals.push(this.armor);
    Ship.Decimals.push(this.shield);
  }
}

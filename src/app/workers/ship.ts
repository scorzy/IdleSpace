class Ship {
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
    const ret = new Ship();
    ret.id = this.id;
    ret.armor = new Decimal(this.armor);
    ret.originalArmor = new Decimal(this.armor);
    ret.shield = new Decimal(this.shield);
    ret.originalShield = new Decimal(this.shield);
    ret.modules = this.modules;
    ret.explosionLevel = this.explosionLevel;

    return ret;
  }
}

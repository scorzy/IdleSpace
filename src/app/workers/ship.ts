class Ship {
  id: string;
  armor: Decimal;
  shield: Decimal;
  modules: Array<{
    damage: Decimal
    shieldPercent: number
    armorPercent: number
  }>;

  getCopy(): Ship {
    const ret = new Ship();
    ret.id = this.id;
    ret.armor = new Decimal(this.armor);
    ret.shield = new Decimal(this.shield);
    ret.modules = this.modules;

    return ret;
  }
}

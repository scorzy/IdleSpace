class Ship {
  private static Ships = new Array<Ship>();
  private active: Boolean;
  fleetIndex: number;
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
  class = "";
  isDefense = false;
  armorReduction: Decimal = new Decimal();
  shieldReduction: Decimal = new Decimal();
  shieldCharger: Decimal = new Decimal();

  getCopy(): Ship {
    const ret = Ship.Ships.pop() || new Ship();
    ret.active = true;
    ret.id = this.id;
    ret.armor.fromDecimal(this.armor);
    ret.shield.fromDecimal(this.shield);
    // Original value shouldn't get modified, reuse original object instead of creating 10000+ new ones for max ships.
    ret.originalArmor = this.originalArmor;
    ret.originalShield = this.originalShield;
    ret.modules = this.modules;
    ret.explosionLevel = this.explosionLevel;
    ret.armorReduction = this.armorReduction;
    ret.shieldReduction = this.shieldReduction;
    ret.shieldCharger = this.shieldCharger;

    ret.class = this.class;

    return ret;
  }

  free(): void {
    // Reuse object to prevent gc
    if (this.active === true){
        this.active = false;
        Ship.Ships.push(this);
    }
  }
}

function MyFromDecimal(obj: any = {}): Decimal {
  if (
    typeof obj === "object" &&
    obj !== null &&
    "mantissa" in obj &&
    "exponent" in obj
  ) {
    return Decimal.fromMantissaExponent(obj.mantissa, obj.exponent);
  }
  return new Decimal(obj);
}

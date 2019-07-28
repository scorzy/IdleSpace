var Ship = /** @class */ (function() {
  function Ship() {
    this.armor = new Decimal();
    this.shield = new Decimal();
    this.modules = new Array();
    this.class = "";
    this.isDefense = false;
    this.armorReduction = new Decimal();
    this.shieldReduction = new Decimal();
    this.shieldCharger = new Decimal();
  }
  Ship.prototype.getCopy = function() {
    var ret = Ship.Ships.pop() || new Ship();
    ret.id = this.id;
    ret.armor = MyFromDecimal(this.armor);
    ret.shield = MyFromDecimal(this.shield);
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
  };
  Ship.prototype.free = function() {
    // Reuse object to prevent gc
    Ship.Ships.push(this);
  };
  Ship.Ships = new Array();
  return Ship;
})();
function MyFromDecimal(obj) {
  if (obj === void 0) {
    obj = {};
  }
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

var Ship = /** @class */ (function () {
    function Ship() {
        this.armor = new Decimal();
        this.shield = new Decimal();
        this.modules = new Array();
    }
    Ship.prototype.getCopy = function () {
        var ret = Ship.Ships.pop() || new Ship();
        ret.id = this.id;
        ret.armor.fromDecimal(this.armor);
        ret.shield.fromDecimal(this.shield);
        // Original value shouldn't get modified, reuse original object instead of creating 10000+ new ones for max ships.
        ret.originalArmor = this.originalArmor;
        ret.originalShield = this.originalShield;
        ret.modules = this.modules;
        ret.explosionLevel = this.explosionLevel;
        return ret;
    };
    Ship.prototype.free = function () {
        // Reuse object to prevent gc
        Ship.Ships.push(this);
    };
    Ship.Ships = new Array();
    return Ship;
}());

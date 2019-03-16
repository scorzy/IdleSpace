var Ship = /** @class */ (function () {
    function Ship() {
        this.modules = new Array();
    }
    Ship.prototype.getCopy = function () {
        var ret = new Ship();
        ret.id = this.id;
        ret.armor = new Decimal(this.armor);
        ret.shield = new Decimal(this.shield);
        ret.modules = this.modules;
        return ret;
    };
    return Ship;
}());

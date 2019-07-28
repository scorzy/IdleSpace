(function(factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports"], factory);
  }
})(function(require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
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
  exports.MyFromDecimal = MyFromDecimal;
});

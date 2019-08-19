export function MyFromDecimal(obj: any = {}): Decimal {
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

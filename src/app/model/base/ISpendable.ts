export interface ISpendable {
  id: string;
  quantity: Decimal;
  name: string;
  a: Decimal;
  b: Decimal;
  c: Decimal;
}
export function isISpendable(obj: any): obj is ISpendable {
  return (
    typeof obj.id === "string" &&
    obj.quantity instanceof Decimal &&
    typeof obj.name === "string" &&
    obj.a instanceof Decimal &&
    obj.b instanceof Decimal &&
    obj.c instanceof Decimal
  );
}

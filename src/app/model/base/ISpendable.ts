export interface ISpendable {
  id: string;
  quantity: Decimal;
  name: string;
  c: Decimal;
  limit: Decimal;
}
export function isISpendable(obj: any): obj is ISpendable {
  return (
    typeof obj.id === "string" &&
    obj.quantity instanceof Decimal &&
    typeof obj.name === "string" &&
    obj.c instanceof Decimal
  );
}

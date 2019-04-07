export interface IResource {
  id: string;
  name: string;
  description: string;
  getQuantity(): Decimal;
}

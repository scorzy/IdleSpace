import { BuyAction } from "../actions/buyAction";

export interface IBuyable {
  actions: BuyAction[];
  quantity: Decimal;
}

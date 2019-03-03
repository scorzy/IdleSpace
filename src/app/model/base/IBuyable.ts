import { BuyAction } from "../actions/buyAction";
import { AbstractAction } from "../actions/abstractAction";

export interface IBuyable {
  actions: AbstractAction[];
  quantity: Decimal;
}

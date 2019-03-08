import { AbstractAction } from "../actions/abstractAction";

export interface IBuyable {
  actions: AbstractAction[];
  quantity: Decimal;
  isLimited: boolean;
  limit: Decimal;
  isCapped: boolean;
}

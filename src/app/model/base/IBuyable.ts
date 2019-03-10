import { Action } from "../actions/abstractAction";

export interface IBuyable {
  actions: Action[];
  quantity: Decimal;
  isLimited: boolean;
  limit: Decimal;
  isCapped: boolean;
}

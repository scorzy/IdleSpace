import { ShipDesign } from "../model/fleet/shipDesign";

export class BattleRequest {
  playerFleet = new Array<ShipDesign>();
  enemyFleet = new Array<ShipDesign>();
}

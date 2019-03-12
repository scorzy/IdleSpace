import { ShipDesign } from "../fleet/shipDesign";

export class Zone {
  completed = false;
  percent = 0;

  ships = new Array<ShipDesign>();
}

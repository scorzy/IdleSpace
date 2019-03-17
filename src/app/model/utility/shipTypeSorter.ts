import { ClrDatagridComparatorInterface } from "@clr/angular";

import { Production } from "../production";
import { ShipDesign } from "../fleet/shipDesign";

export class ShipTypeSorter
  implements ClrDatagridComparatorInterface<ShipDesign> {
  compare(a: ShipDesign, b: ShipDesign) {
    return a.type.navalCapacity - b.type.navalCapacity;
  }
}

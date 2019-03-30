import { ClrDatagridComparatorInterface } from "@clr/angular";

import { ShipDesign } from "../fleet/shipDesign";

export class ShipOrderSorter
  implements ClrDatagridComparatorInterface<ShipDesign> {
  compare(a: ShipDesign, b: ShipDesign) {
    return a.order - b.order;
  }
}

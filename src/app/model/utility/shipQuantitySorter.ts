import { ClrDatagridComparatorInterface } from "@clr/angular";

import { ShipDesign } from "../fleet/shipDesign";

export class ShipQuantitySorter
  implements ClrDatagridComparatorInterface<ShipDesign> {
  compare(a: ShipDesign, b: ShipDesign) {
    return a.quantity.cmp(b.quantity);
  }
}

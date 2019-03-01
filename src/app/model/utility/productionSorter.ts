import { ClrDatagridComparatorInterface } from "@clr/angular";

import { Production } from "../production";

export class ProductionSorter
  implements ClrDatagridComparatorInterface<Production> {
  compare(a: Production, b: Production) {
    return a.prodPerSec.cmp(b.prodPerSec);
  }
}

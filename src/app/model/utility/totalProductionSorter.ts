import { ClrDatagridComparatorInterface } from "@clr/angular";

import { Production } from "../production";

export class TotalProductionSorter
  implements ClrDatagridComparatorInterface<Production> {
  compare(a: Production, b: Production) {
    return a.prodPerSec
      .times(a.producer.quantity)
      .cmp(b.prodPerSec.times(b.producer.quantity));
  }
}

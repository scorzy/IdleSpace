import { ClrDatagridComparatorInterface } from "@clr/angular";
import { Resource } from "../resource/resource";

export class ExpansionResourceSorter
  implements ClrDatagridComparatorInterface<Resource> {
  compare(a: Resource, b: Resource) {
    const a1 = a.limitStorage ? a.limitStorage.quantity : new Decimal();
    const b1 = b.limitStorage ? b.limitStorage.quantity : new Decimal();
    return a1.cmp(b1);
  }
}

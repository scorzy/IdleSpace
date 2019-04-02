import { ClrDatagridComparatorInterface } from "@clr/angular";
import { Resource } from "../resource/resource";

export class LimitResourceSorter
  implements ClrDatagridComparatorInterface<Resource> {
  compare(a: Resource, b: Resource) {
    return a.limit.cmp(b.limit);
  }
}

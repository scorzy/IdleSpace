import { ClrDatagridComparatorInterface } from "@clr/angular";
import { Resource } from "../resource/resource";

export class ResourceQuantitySorter
  implements ClrDatagridComparatorInterface<Resource> {
  compare(a: Resource, b: Resource) {
    return a.quantity.cmp(b.quantity);
  }
}

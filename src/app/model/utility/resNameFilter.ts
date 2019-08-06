import { ClrDatagridStringFilterInterface } from "@clr/angular";
import { Research } from "../research/research";

export class ResNameFilter
  implements ClrDatagridStringFilterInterface<Research> {
  accepts(item: Research, search: string): boolean {
    return (
      item.name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1
    );
  }
}

import { Pipe, PipeTransform } from "@angular/core";
import { getSizeName } from "./model/fleet/module";

@Pipe({
  name: "sizeName"
})
export class SizeNamePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return getSizeName(value);
  }
}

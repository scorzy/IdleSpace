import { Pipe, PipeTransform } from "@angular/core";
import { Sizes } from "./model/fleet/module";

@Pipe({
  name: "sizes"
})
export class SizesPipe implements PipeTransform {
  transform(value: Sizes[], max?: number): any {
    return value.filter(v => v <= max);
  }
}

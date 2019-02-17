import { Pipe, PipeTransform } from "@angular/core";
import { convertToRoman } from "ant-utils";

@Pipe({
  name: "roman"
})
export class RomanPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return convertToRoman(value);
  }
}

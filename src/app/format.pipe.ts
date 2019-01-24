import { Pipe, PipeTransform } from "@angular/core";
import { OptionsService } from "./options.service";

@Pipe({
  name: "format"
})
export class FormatPipe implements PipeTransform {
  constructor(public options: OptionsService) {}

  transform(value: any, integer?: boolean, formatter?: any): any {
    value = new Decimal(value);
    if (!formatter) formatter = this.options.formatter;

    let str = "";
    if (value.abs().lt(100000)) {
      let num = value.abs().toNumber();
      const digits =
        integer || num >= 100
          ? 0
          : num < 10
          ? num < 0.001 && num !== 0
            ? 6
            : 2
          : 1;
      if (num < 100) {
        const pow = Math.pow(10, digits + 1);
        num = Math.floor(num * pow) / pow;
      } else {
        num = Math.floor(num);
      }
      str = num.toLocaleString(this.options.usaFormat ? "en-US" : "it-IT", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
    } else {
      str = formatter.formatShort(value.abs());
      if (integer && value.abs().lessThan(100)) str = str.replace(/\.0+$/, "");
      if (!this.options.usaFormat) str = str.replace(".", ",");
    }

    return (value.lt(0) ? "-" : "") + str;
  }
}

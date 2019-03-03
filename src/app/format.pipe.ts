import { Pipe, PipeTransform, OnDestroy } from "@angular/core";
import { OptionsService } from "./options.service";

@Pipe({
  name: "format"
})
export class FormatPipe implements PipeTransform, OnDestroy {
  private map: Map<string, string> = new Map<string, string>();
  private interval: number;

  constructor(public options: OptionsService) {
    this.interval = window.setInterval(this.clear.bind(this), 2000);
  }

  transform(value1: any, integer?: boolean, formatter?: any): any {
    const value = new Decimal(value1);

    let index = "";
    if (!formatter) {
      index = value.toString() + !!integer;
      const ret1 = this.map.get(index);
      if (ret1 !== undefined) return ret1;
    }

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
      if (integer) str = str.replace(/\.0+$/, "");
      if (!this.options.usaFormat) str = str.replace(".", ",");
    }

    const ret = (value.lt(0) ? "-" : "") + str;

    if (index !== "") {
      this.map.set(index, ret);
    }

    return ret;
  }

  clear() {
    if (this.map.entries.length > 100) this.map.clear();
  }
  ngOnDestroy(): void {
    if (this.interval > 0) clearInterval(this.interval);
  }
}

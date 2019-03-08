import { Pipe, PipeTransform } from "@angular/core";
import { FormatPipe } from "./format.pipe";
import { OptionsService } from "./options.service";
import * as distanceInWordsStrict from "date-fns/distance_in_words_strict";
import * as distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import * as isValid from "date-fns/is_valid";
const SECONDS_IN_YEAR = 3.154e7;
@Pipe({
  name: "endIn"
})
export class EndInPipe implements PipeTransform {
  pipeFormat: FormatPipe;
  constructor(public options: OptionsService) {
    this.pipeFormat = new FormatPipe(options);
  }

  transform(value: number, args?: any): any {
    if (!isNaN(value) && value > 0 && value < Number.POSITIVE_INFINITY) {
      const dateEnd = new Date(Date.now() + value);
      if (isValid(dateEnd)) {
        return this.options.timeFormatDetail
          ? distanceInWordsStrict(0, value)
          : distanceInWordsToNow(new Date(Date.now() + value));
      } else {
        return (
          "in " + this.pipeFormat.transform(value / SECONDS_IN_YEAR) + " years"
        );
      }
    } else {
      return "never";
    }
  }
}

import {
  MOD_EFFICIENCY,
  MOD_PRODUCTION,
  MOD_ENERGY,
  MOD_MORE
} from "./modStack";
import { MainService } from "src/app/main.service";

export const ModData = {
  f: {
    name: "Wasteful / Efficient",
    description: "Output production",
    tooltip: "Increase or decrease yielded resources; stack additive",
    getBonus: (num: DecimalSource) => {
      return (
        (new Decimal(num).gt(0) ? "+" : "") +
        MainService.formatPipe.transform(
          Decimal.multiply(MOD_EFFICIENCY, num).times(100)
        ) +
        "%"
      );
    },
    min: -9
  },
  p: {
    name: "Unproductive / Productive",
    description: "Production and Upkeep",
    tooltip:
      "Increase or decrease yielded and consumed resources; stack additive",
    getBonus: (num: DecimalSource) => {
      return (
        (new Decimal(num).gt(0) ? "+" : "") +
        MainService.formatPipe.transform(
          Decimal.multiply(MOD_PRODUCTION, num).times(100)
        ) +
        "%"
      );
    },
    min: -3
  },
  e: {
    name: "Energy-intensive / Energy-saving",
    description: "Energy usage",
    tooltip: "Increase or decrease energy usage",
    max: 10,
    getBonus: (num: DecimalSource) => {
      return (
        (new Decimal(num).lt(0) ? "+" : "") +
        MainService.formatPipe.transform(
          Decimal.multiply(MOD_ENERGY, num).times(100)
        ) +
        "%"
      );
    }
  },
  s: {
    name: "Expensive / Economic",
    description: "Robot Price",
    tooltip:
      "Increase or decrease number or robots components needed to make a drone",
    max: 7,
    getBonus: (num: DecimalSource) => {
      return MainService.formatPipe.transform(
        new Decimal(1).plus(new Decimal(num).times(-0.1))
      );
    }
  },
  m: {
    name: "More Drones",
    description: "More Drones",
    tooltip: "Increase the number of drones you can have",
    min: 0,
    getBonus: (num: DecimalSource) => {
      return (
        "+" +
        MainService.formatPipe.transform(
          new Decimal(num).times(100).times(MOD_MORE)
        ) +
        "%"
      );
    }
  }
};

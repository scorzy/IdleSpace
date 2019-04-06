import { MOD_EFFICIENCY, MOD_PRODUCTION, MOD_ENERGY } from "./modStack";
import { MainService } from "src/app/main.service";

export const ModData = {
  f: {
    name: "Wasteful / Efficient",
    description: "Output production",
    getBonus: (num: DecimalSource) => {
      return (
        (new Decimal(num).gt(0) ? "+" : "") +
        Decimal.multiply(MOD_EFFICIENCY, num).times(100) +
        "%"
      );
    }
  },
  p: {
    name: "Unproductive / Productive",
    description: "Production and Upkeep",
    getBonus: (num: DecimalSource) => {
      return (
        (new Decimal(num).gt(0) ? "+" : "") +
        Decimal.multiply(MOD_PRODUCTION, num).times(100) +
        "%"
      );
    }
  },
  e: {
    name: "Energy-intensive / Energy-saving",
    description: "Energy usage",
    max: 10,
    getBonus: (num: DecimalSource) => {
      return (
        (new Decimal(num).lt(0) ? "+" : "") +
        Decimal.multiply(MOD_ENERGY, num).times(100) +
        "%"
      );
    }
  },
  s: {
    name: "Expensive / Economic",
    description: "Standard Price",
    max: 10,
    getBonus: (num: DecimalSource) => {
      return MainService.formatPipe.transform(
        new Decimal(0.9).pow(new Decimal(num))
      );
    }
  }
};

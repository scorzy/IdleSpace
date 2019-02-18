import { Bonus } from "./bonus";

export class BonusStack {
  additiveBonus = new Array<Bonus>();
  multiplicativeBonus = new Array<Bonus>();

  getAdditiveBonus(): Decimal {
    return this.additiveBonus
      .map(b => b.quantity.times(b.base.quantity))
      .reduce((p, c) => p.plus(c), new Decimal(0));
  }
  getMultiplicativeBonus(): Decimal {
    return this.multiplicativeBonus
      .filter(t => t.base.quantity.gt(0))
      .map(b => b.quantity.times(b.base.quantity).plus(1))
      .reduce((p, c) => p.times(c), new Decimal(1));
  }
}

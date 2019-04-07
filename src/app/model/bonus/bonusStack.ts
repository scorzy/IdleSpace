import { Bonus } from "./bonus";

export class BonusStack {
  additiveBonus = new Array<Bonus>();
  multiplicativeBonus = new Array<Bonus>();

  private getAdditiveBonus(positiveOnly = false): Decimal {
    return this.additiveBonus
      .filter(b => !b.positiveOnly || !positiveOnly)
      .map(b => b.quantity.times(b.base.getQuantity()))
      .reduce((p, c) => p.plus(c), new Decimal(0));
  }
  private getMultiplicativeBonus(positiveOnly = false): Decimal {
    return this.multiplicativeBonus
      .filter(
        t => (!t.positiveOnly || !positiveOnly) && !t.base.getQuantity().eq(0)
      )
      .map(b => {
        if (b.base.getQuantity().gt(0)) {
          return b.quantity.times(b.base.getQuantity()).plus(1);
        } else {
          return new Decimal(1).minus(
            b.quantity.times(b.base.getQuantity().abs())
          );
        }
      })
      .reduce((p, c) => p.times(c), new Decimal(1));
  }
  getTotalBonus(positiveOnly = false): Decimal {
    return this.getAdditiveBonus(positiveOnly)
      .plus(1)
      .times(this.getMultiplicativeBonus(positiveOnly));
  }
}

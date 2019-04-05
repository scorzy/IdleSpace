import { Resource } from "./resource/resource";
import { BonusStack } from "./bonus/bonusStack";

export class Production {
  prodPerSec = new Decimal(1);
  ratio: Decimal;
  productionMultiplier: BonusStack;

  constructor(
    public producer: Resource,
    public product: Resource,
    ratio: DecimalSource = new Decimal(1)
  ) {
    this.ratio = new Decimal(ratio);
    this.prodPerSec = this.ratio;
  }
}

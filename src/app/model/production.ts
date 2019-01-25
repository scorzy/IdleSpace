import { Resource } from "./resource/resource";

export class Production {
  prodPerSec = new Decimal(1);
  ratio: Decimal;

  constructor(
    public producer: Resource,
    public product: Resource,
    ratio: DecimalSource = new Decimal(1)
  ) {
    this.ratio = new Decimal(ratio);
    this.prodPerSec = this.ratio;
  }
}

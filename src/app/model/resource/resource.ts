import { AbstractUnlockable } from "../base/AbstractUnlockable";
import { ISpendable } from "../base/ISpendable";
import { Production } from "../production";
import { descriptions } from "../descriptions";

export class Resource extends AbstractUnlockable implements ISpendable {
  name: string;
  description: string;

  unlocked = false;
  quantity = new Decimal(0);
  efficiency = 1;
  a = new Decimal(0);
  b = new Decimal(0);
  c = new Decimal(0);
  endIn: number = Number.POSITIVE_INFINITY;
  isEnding = false;

  products = new Array<Production>();
  generators = new Array<Production>();

  constructor(public id: string) {
    super();
    this.name = descriptions.resources[id][0];
    this.description = descriptions.resources[id][1];
  }

  addGenerator(generator: Resource, ratio: DecimalSource = 1): void {
    const prod = new Production(generator, this, ratio);
    this.generators.push(prod);
    generator.products.push(prod);
  }
  isActive(): boolean {
    return (
      this.unlocked && this.efficiency > Number.EPSILON && this.quantity.gt(0)
    );
  }

  reset(): void {
    super.reset();
    this.quantity = new Decimal(0);
    this.a = new Decimal(0);
    this.b = new Decimal(0);
    this.c = new Decimal(0);
  }
  getSave(): any {
    const data = super.getSave();
    if (!this.quantity.eq(0)) data.q = this.quantity;
    return data;
  }
  load(data: any): boolean {
    if (!super.load(data)) return false;
    this.quantity = new Decimal("q" in data ? data.q : 0);
    return true;
  }
}

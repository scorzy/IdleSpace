import { Module } from "./module";

export class DesignLine {
  constructor(
    public quantity: Decimal = new Decimal(0),
    public module: Module = null,
    public quantityUi = 0,
    public moduleId = ""
  ) {}

  static copy(other: DesignLine): DesignLine {
    return new DesignLine(
      new Decimal(other.quantity),
      other.module,
      other.quantityUi,
      other.moduleId
    );
  }

  isValid() {
    return this.module && this.quantity.gt(0);
  }
}

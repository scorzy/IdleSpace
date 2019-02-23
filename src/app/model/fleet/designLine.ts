import { Module, Sizes } from "./module";

export class DesignLine {
  constructor(
    public quantity = 1,
    public module: Module = null,
    public size: Sizes = 1,
    public quantityUi = 1,
    public moduleId = ""
  ) {}

  static copy(other: DesignLine): DesignLine {
    return new DesignLine(
      other.quantity,
      other.module,
      Sizes.Small,
      other.quantityUi,
      other.moduleId
    );
  }

  isValid() {
    return this.module && this.quantity > 0;
  }
}

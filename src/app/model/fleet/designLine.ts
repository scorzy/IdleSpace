import { Module, Sizes } from "./module";
import { FleetManager } from "./fleetManager";

export class DesignLine {
  maxLevel = 1;
  constructor(
    public quantity = 1,
    public module: Module = null,
    public size: Sizes = Sizes.Small,
    public level = 1,
    public quantityUi = 1,
    public moduleId = "",
    public levelUi = 1
  ) {
    this.setMaxLevel();
  }

  static copy(other: DesignLine): DesignLine {
    return new DesignLine(
      other.quantity,
      other.module,
      other.size,
      other.level,
      other.quantity,
      other.module.id,
      other.level
    );
  }
  static CreateFromData(data: any): DesignLine {
    const ret = new DesignLine();
    ret.quantity = data.q;
    ret.module = FleetManager.getInstance().allModules.find(
      m => m.id === data.m
    );
    ret.size = data.s;

    return ret;
  }

  isValid() {
    return this.module && this.quantity > 0;
  }
  setMaxLevel() {
    this.maxLevel =
      this.module && this.module.research
        ? this.module.research.quantity.toNumber()
        : 1;
  }

  getSave(): any {
    const data: any = {};
    data.q = this.quantity;
    data.m = this.module.id;
    data.s = this.size;
    return data;
  }
}

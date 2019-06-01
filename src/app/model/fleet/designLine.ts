import { Module, Sizes } from "./module";
import { FleetManager } from "./fleetManager";
import { AllSkillEffects } from "../prestige/allSkillEffects";

export class DesignLine {
  maxLevel = 10;
  computedDamage = new Decimal(0);
  constructor(
    public module: Module = null,
    public size: Sizes = Sizes.Small,
    public level = 10,
    public moduleId = "",
    public levelUi = 10
  ) {
    this.setMaxLevel();
  }

  static copy(other: DesignLine): DesignLine {
    return new DesignLine(
      other.module,
      other.size,
      other.level,
      other.module ? other.module.id : "",
      other.level
    );
  }
  static CreateFromData(data: any): DesignLine {
    const ret = new DesignLine();
    ret.module = FleetManager.getInstance().allModules.find(
      m => m.id === data.m
    );
    ret.size = data.s;
    if ("l" in data) ret.level = data.l;

    return ret;
  }

  isValid() {
    return this.module;
  }
  setMaxLevel() {
    this.maxLevel = Math.floor(
      (10 +
        (this.module && this.module.research
          ? this.module.research.quantity.toNumber()
          : 1)) *
        (1 + AllSkillEffects.MODULE_LEVEL.numOwned)
    );
  }

  getSave(): any {
    const data: any = {};
    data.m = this.module.id;
    data.s = this.size;
    data.l = this.level;
    return data;
  }
}

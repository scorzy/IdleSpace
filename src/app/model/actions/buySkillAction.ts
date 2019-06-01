import { BuyAction } from "./buyAction";
import { SkillEffect } from "../prestige/skillEffects";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";
import { PrestigeManager } from "../prestige/prestigeManager";
import { AllSkillEffects } from "../prestige/allSkillEffects";

export class BuySkillAction extends BuyAction {
  constructor(public skillEffect: SkillEffect) {
    super(
      skillEffect,
      new MultiPrice([new Price(SkillEffect.availableSkill, 1, 1)])
    );
    this.name = this.skillEffect.getDescription(1);
  }
  afterBuy(number: Decimal) {
    const multi = Math.max(2 * PrestigeManager.getInstance().ascension, 1);
    this.skillEffect.numOwned =
      number.toNumber() * multi * this.quantity.toNumber();
    this.skillEffect.afterBuy();

    AllSkillEffects.effectList
      .map(s => s.buyAction)
      .forEach(a => {
        a.reload();
      });
  }

  reload() {
    const groupNum = this.skillEffect.skillGroup.skills
      .map(s => s.quantity.toNumber())
      .reduce((p, c) => p + c, 0);

    this.skillEffect.limit = Decimal.min(
      this.skillEffect.maxLimit,
      PrestigeManager.getInstance().totalPrestige *
        this.skillEffect.skillGroup.maxPercent -
        groupNum +
        this.quantity.toNumber()
    ).floor();
    if (this.skillEffect.limit.gt(0)) super.reload();
    else {
      this.canBuy = false;
    }
    if (this.maxBuy.lt(1)) this.canBuy = false;
  }
}

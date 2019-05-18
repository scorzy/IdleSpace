import { IResource } from "../base/iResource";
import { ISalvable } from "../base/ISalvable";
import { SkillGroup } from "./skillGroup";
import { SkillGroups, AllSkillEffects } from "./allSkillEffects";
import { Action } from "../actions/abstractAction";
import { BuyAction } from "../actions/buyAction";
import { IBuyable } from "../base/IBuyable";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";
import { PrestigeManager } from "./prestigeManager";
import { ISpendable } from "../base/ISpendable";
import { MainService } from "src/app/main.service";
import { Emitters } from "src/app/emitters";

export class SkillEffect implements IResource, ISalvable, IBuyable {
  static availableSkill: ISpendable = {
    id: "avSk",
    quantity: new Decimal(0),
    name: "Prestige point",
    c: new Decimal(0),
    limit: new Decimal(Number.MAX_SAFE_INTEGER)
  };

  id: string;
  notable = false;
  shape: string;
  numOwned = 0;
  numBuy = 0;
  label = "";
  name: string;
  description: string;
  shapeNotAvailable: string;
  shapeOwned: string;
  shapeAvailable: string;
  skillGroup: SkillGroup;
  buyAction: Action;
  actions: Action[];
  quantity = new Decimal(0);
  isLimited = false;
  limit = new Decimal(Number.MAX_SAFE_INTEGER);
  isCapped = false;

  constructor(idNum: number, skillGroupId: string) {
    this.id = "" + idNum;
    this.skillGroup = SkillGroups.find(g => g.id === skillGroupId);
    this.skillGroup.skills.push(this);

    this.buyAction = new BuyAction(
      this,
      new MultiPrice([new Price(SkillEffect.availableSkill, 1, 1)])
    );
    this.buyAction.name = this.getDescription(1);
    this.buyAction.afterBuy = (number: Decimal) => {
      const multi = Math.max(2 * PrestigeManager.getInstance().ascension, 1);
      this.numBuy++;
      this.numOwned = number.toNumber() * multi * this.numBuy;
      this.afterBuy();

      AllSkillEffects.effectList
        .map(s => s.buyAction)
        .forEach(a => {
          a.reload();
        });
    };
    Emitters.getInstance().prestigeEmitter.emit(this.id);
  }

  getDescription(num = 1): string {
    return "";
  }
  getQuantity(): Decimal {
    return new Decimal(this.numOwned);
  }
  afterBuy() {}

  getSave() {
    const save: any = {};
    save.i = this.id;
    save.q = this.numBuy;
    return save;
  }
  load(data: any): boolean {
    if (!("i" in data || data.i !== this.id)) return false;
    if ("q" in data) this.numBuy = data.q;
    return true;
  }
}

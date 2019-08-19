import { IResource } from "../base/iResource";
import { ISalvable } from "../base/ISalvable";
import { SkillGroup } from "./skillGroup";
import { SkillGroups } from "./allSkillEffects";
import { Action } from "../actions/abstractAction";
import { IBuyable } from "../base/IBuyable";
import { ISpendable } from "../base/ISpendable";
import { BuySkillAction } from "../actions/buySkillAction";
import { MyFromDecimal } from "../utility/myUtility";

export class SkillEffect implements IResource, ISalvable, IBuyable {
  public static availableSkill: ISpendable = {
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
  label = "";
  name: string;
  description: string;
  shapeNotAvailable: string;
  shapeOwned: string;
  shapeAvailable: string;
  skillGroup: SkillGroup;
  buyAction: BuySkillAction;
  actions: Action[];
  quantity = new Decimal(0);
  isLimited = true;
  limit = new Decimal(Number.MAX_SAFE_INTEGER);
  isCapped = false;

  constructor(
    idNum: number,
    skillGroupId: string,
    public maxLimit = Number.MAX_SAFE_INTEGER
  ) {
    this.id = "" + idNum;
    this.skillGroup = SkillGroups.find(g => g.id === skillGroupId);
    this.skillGroup.skills.push(this);

    this.buyAction = new BuySkillAction(this);
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
    save.q = this.quantity;
    return save;
  }
  load(data: any): boolean {
    if (!("i" in data || data.i !== this.id)) return false;
    if ("q" in data) this.quantity = MyFromDecimal(data.q);
    return true;
  }
}
